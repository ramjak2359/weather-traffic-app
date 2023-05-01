"use client";
import {useEffect, useState} from "react";
import styles from './page.module.scss'
import {getDay} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image'
import {DatePicker, DatePickerProps, Select, TimePicker} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSun} from "@fortawesome/free-regular-svg-icons";
import {faCarRear} from "@fortawesome/free-solid-svg-icons";

interface IPageProps {
}

const Page = (props: IPageProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (date) {
      const timeDate = date.toDate();
      const year = timeDate.getFullYear();
      const month = timeDate.getMonth();
      const day = timeDate.getDate();

      setDate(d => {
        const currDate = d ? new Date(d.getTime()) : new Date();
        currDate.setFullYear(year);
        currDate.setMonth(month);
        currDate.setDate(day);
        return currDate;
      })
    }
  };
  const onTimeChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (date) {
      const timeDate = date.toDate();
      const hours = timeDate.getHours();
      const minutes = timeDate.getMinutes();
      const seconds = timeDate.getSeconds();

      setDate(d => {
        const currDate = d ? new Date(d.getTime()) : new Date();
        currDate.setHours(hours);
        currDate.setMinutes(minutes);
        currDate.setSeconds(seconds);
        return currDate;
      })
    }
  };

  const [options, setOptions] = useState([]);
  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };

  useEffect(() => {

  });

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <i className={styles.icon}>
            <FontAwesomeIcon icon={faCarRear} size="2x"  />
          </i>
          Traffic and Weather App
        </p>
      </div>

      <div className={styles.center}>
        {/*<Image*/}
        {/*  className={styles.logo}*/}
        {/*  src="/next.svg"*/}
        {/*  alt="Next.js Logo"*/}
        {/*  width={180}*/}
        {/*  height={37}*/}
        {/*  priority*/}
        {/*/>*/}
      </div>

      <div className={styles.grid}>
        <DatePicker onChange={onChange} size="large" />
        <TimePicker onChange={onTimeChange} size="large" />
        <Select
          size="large"
          onChange={handleChange}
          options={options}
          disabled={!!date}
        />
        <a
          href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        {/*<a*/}
        {/*  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"*/}
        {/*  className={styles.card}*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  <h2>*/}
        {/*    Deploy <span>-&gt;</span>*/}
        {/*  </h2>*/}
        {/*  <p>*/}
        {/*    Instantly deploy your Next.js site to a shareable URL with Vercel.*/}
        {/*  </p>*/}
        {/*</a>*/}
      </div>
    </main>
  );
}

export default Page;
