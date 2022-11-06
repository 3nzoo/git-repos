import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import './styles.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DebounceInput } from 'react-debounce-input';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { tableType } from './components/constants';
import PaginationComponent from './components/Pagination';
import LoadMore from './components/Loadmore';
import UnliScroll from './components/Unliscroll';
import { minWidth } from '@mui/system';
import { IdataRepos } from './components/interfaces/app';
import SelectLanguage from './components/selectLanguage';

//! Display a list of repositories ordered by star count to the user.
//! The user should be able to filter the list by programming language
//! The user should be able to access additional pages using a pagination strategy of your choice (e.g next/prev links, load more link, infinite scroll).
//! Feel free to use any third party libraries you think are appropriate.

// TODO 0. created function in buttons - DONE!!
//TODO 1. add axios get user data - DONE!!
//TODO 2. add state currentPage if data shown has reached limit
// TODO 3. Language category in a drop down menu (replace the current input box) - DONE!!
// TODO 4. create Pagination table component
// TODO 5. create Loadmore table component
// TODO 6. create Unliscroll table component

export const App = () => {
  const [gitUser, setGitUser] = useState('');
  const [dataRepos, setDataRepos] = useState([]);
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(false);
  const [progLanguages, setProgLanguages] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [currentTable, setCurrentTable] = useState(tableType.PAGINATION);
  const [queryPage, setQueryPage] = useState(1);
  const [page, setPage] = useState(1);
  const handleChange = (e: string) => {
    setGitUser(e);
  };

  const handleChangeLanguage = (e: string) => {
    setSelectLanguage(e);
  };

  useEffect(() => {
    const controller = new AbortController();

    if (gitUser.length && effectRan.current === true) {
      setLoading(true);
      const getUserRepos = async () => {
        try {
          // TODO axios get the repo from the user input (useEffect) DONE
          //! GITHUB Limit response is 100
          const res = await axios.get(
            `https://api.github.com/users/${gitUser}/repos??page=${queryPage}&per_page=200`,
            {
              signal: controller.signal,
            }
          );

          const filterData = await res.data.map(
            (item: IdataRepos, index: number) => {
              return {
                id: index,
                name: item.name,
                language: item.language,
                stargazers_count: item.stargazers_count,
              };
            }
          );

          // TODO Data must be descending order by rating
          const sorted = await filterData.sort(
            (a: IdataRepos, b: IdataRepos) => {
              return b.stargazers_count - a.stargazers_count;
            }
          );

          setSortedData(sorted);
          setDataRepos(sorted);

          const currentLanguages = res.data.map((val: IdataRepos) => {
            return val.language;
          });

          // TODO put language category in a drop down menu to filter data results
          setProgLanguages(
            currentLanguages.filter(
              (val: string, index: number, arrLanguage: string[]) =>
                arrLanguage.indexOf(val) == index
            )
          );
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      getUserRepos();
    }

    return () => {
      controller.abort;
      effectRan.current = true;
    };
  }, [gitUser]);

  useEffect(() => {
    if (selectLanguage.length && effectRan.current === true) {
      // TODO FEATURE filter language result for prog language category DONE
      setDataRepos(
        sortedData.filter((item: IdataRepos) => item.language == selectLanguage)
      );
    }

    return () => {
      effectRan.current = true;
    };
  }, [setSelectLanguage, selectLanguage]);

  // if (dataRepos.length) {
  //   console.log(dataRepos);
  //   console.log(progLanguages);
  //   console.log(selectLanguage);
  // }

  return (
    <React.Fragment>
      <Container disableGutters={true} fixed maxWidth={'xl'}>
        <Box sx={{ height: '100vh' }}>
          <div className="header">
            <Stack
              justifyContent="center"
              alignItems="flex-end"
              direction="row"
              spacing={3}
              style={{ width: '100%' }}
            >
              <Box sx={{ width: 'auto', maxWidth: '190px' }}>
                <p>Search github user (e.g. graydon, tonymorris) </p>
                <DebounceInput
                  className="input_field"
                  placeholder="Username here..."
                  minLength={1}
                  debounceTimeout={500}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(event.target.value)
                  }
                />
              </Box>
              <Box>
                <p>Filter by Language</p>
                <SelectLanguage
                  isLoading={loading}
                  language={progLanguages}
                  handleSelectLanguage={handleChangeLanguage}
                  currentSelected={selectLanguage}
                />
              </Box>
              <Button
                style={{ height: 'auto', minHeight: '50px', minWidth: '100px' }}
                variant="contained"
                onClick={() => {
                  setCurrentTable(tableType.PAGINATION);
                }}
              >
                Pagination
              </Button>
              <Button
                style={{ height: 'auto', minHeight: '50px', minWidth: '100px' }}
                variant="contained"
                onClick={() => {
                  setCurrentTable(tableType.LOAD);
                }}
              >
                Load More
              </Button>
              <Button
                style={{ height: 'auto', minHeight: '50px', minWidth: '100px' }}
                variant="contained"
                onClick={() => {
                  setCurrentTable(tableType.UNLISCROLL);
                }}
              >
                Unli Scroll
              </Button>
            </Stack>
          </div>
          {loading ? (
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              style={{ width: '100%' }}
            >
              Loading...
            </Stack>
          ) : (
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              style={{ width: '100%' }}
            >
              {currentTable === tableType.PAGINATION && (
                <PaginationComponent data={dataRepos} limit={8} />
              )}
              {currentTable === tableType.LOAD && <LoadMore />}
              {currentTable === tableType.UNLISCROLL && <UnliScroll />}
            </Stack>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};
