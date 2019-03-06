import React from 'react';

const addLeadingZero = num => num < 10 ? '0' + num : String(num);

const FormattedTime = ({time, withMS}) => {
    const min = addLeadingZero(Math.floor(time / 1000 / 60));
    const rawSec = time / 1000 % 60;
    const sec = addLeadingZero(withMS ? rawSec : Math.floor(rawSec));

    return <span>{min} : {sec}</span>;
};

export default FormattedTime;