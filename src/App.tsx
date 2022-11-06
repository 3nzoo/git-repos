import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
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
import { IdataRepos } from './components/interfaces/app';
import SelectLanguage from './components/selectLanguage';

// TODO 1. created function in buttons - DONE!!
// TODO 2. add axios get user data - DONE!!
// TODO 3. Language category in a drop down menu (replace the current input box) - DONE!!
// TODO 4. create Pagination table component - Done!!
// TODO 5. create Loadmore table component - Done!!
// TODO 6. create Unliscroll table component - Done!!
// TODO 7. add state currentPage if data shown has reached limit

export const App = () => {
  const [gitUser, setGitUser] = useState('');
  const [dataRepos, setDataRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progLanguages, setProgLanguages] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [currentTable, setCurrentTable] = useState(tableType.PAGINATION);

  //? avoid useEffect double render call
  const effectRan = useRef(false);

  //? preparation for loading more response if user Repo is > 100
  const [queryPage, setQueryPage] = useState(1);

  const handleChange = (e: string) => {
    setGitUser(e);
  };

  const handleChangeLanguage = (e: string) => {
    setSelectLanguage(e);
  };

  useEffect(() => {
    //! AbortController = canceling request the fetch API way
    const controller = new AbortController();

    if (gitUser.length && effectRan.current === true) {
      setLoading(true);
      setSelectLanguage('');
      const getUserRepos = async () => {
        try {
          //! GITHUB Limit response is 100 (didn't use page query as there is no api sort response for stars rate)
          const res = await axios.get(
            `https://api.github.com/users/${gitUser}/repos??page=${queryPage}&per_page=100`,
            {
              signal: controller.signal,
            }
          );

          //! Get only repo Name, Language and Star Count
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

          // TODO Data must be descending order by star rating
          const sorted = await filterData.sort(
            (a: IdataRepos, b: IdataRepos) => {
              return b.stargazers_count - a.stargazers_count;
            }
          );

          //! base of language filtering feature
          setSortedData(sorted);

          //! will be overwritten by language filtering and used for table components
          setDataRepos(sorted);

          const currentLanguages = res.data.map((val: IdataRepos) => {
            return val.language;
          });

          // TODO put language category in a drop down select menu to filter data results
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

  // TODO filter language result for prog language category DONE
  useEffect(() => {
    if (selectLanguage.length && effectRan.current === true) {
      setDataRepos(
        sortedData.filter((item: IdataRepos) => item.language == selectLanguage)
      );
    }

    return () => {
      effectRan.current = true;
    };
  }, [setSelectLanguage, selectLanguage]);

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
                <PaginationComponent data={dataRepos} limit={10} />
              )}
              {currentTable === tableType.LOAD && (
                <LoadMore data={dataRepos} limit={5} />
              )}
              {currentTable === tableType.UNLISCROLL && (
                <UnliScroll data={dataRepos} limit={10} />
              )}
            </Stack>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};
