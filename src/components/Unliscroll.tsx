// import React, { useCallback, useRef, useState } from 'react';

const UnliScroll: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  // const lastElement = useCallback((el) => {
  //   if (loading) return;
  //   if (observer.current) observer.current.disconnect();
  //   console.log(el);
  // });
  // return <div ref={lastElement}>Unliscroll</div>;

  return <div>Unliscroll</div>;
};

export default UnliScroll;
