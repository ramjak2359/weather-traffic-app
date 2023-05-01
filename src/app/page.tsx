"use client";
import {useEffect, useMemo, useState} from "react";
import styles from './page.module.scss'
import {getDay} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image'
import {DatePicker, DatePickerProps, Select, TimePicker} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSun} from "@fortawesome/free-regular-svg-icons";
import {faCarRear} from "@fortawesome/free-solid-svg-icons";
import {AreaMetadata, Camera, TrafficDTO, WeatherDTO} from "@/types";
import QueryString from 'query-string';

interface IPageProps {
}

const Page = (props: IPageProps) => {
  const [date, setDate] = useState(new Date());
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (date) {
      const timeDate = date.toDate();
      const year = timeDate.getFullYear();
      const month = timeDate.getMonth();
      const day = timeDate.getDate();

      setDate(d => {
        const currDate = new Date(d.getTime());
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
        const currDate = new Date(d.getTime());
        currDate.setHours(hours);
        currDate.setMinutes(minutes);
        currDate.setSeconds(seconds);
        return currDate;
      })
    }
  };
  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };

  const [cameras, setCameras] = useState<Camera[]>();
  const loadTraffic = async (dateParam: Date) => {
    const TRAFFIC_API_URL = "https://api.data.gov.sg/v1/transport/traffic-images";
    const dateString = dateParam.toISOString()
    const query = {
      date_time: dateString.substring(0, dateString.length - 5)
    };
    const queryString = QueryString.stringify(query);
    const response = await fetch(TRAFFIC_API_URL+'?'+queryString);
    const jsonData: TrafficDTO = await response.json();
    setCameras(jsonData.items[0].cameras);
  }

  const [locations, setLocations] = useState<AreaMetadata[]>();
  const loadWeatherAndLocation = async (dateParam: Date) => {
    const TRAFFIC_API_URL = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
    const dateString = dateParam.toISOString()
    const query = {
      date_time: dateString.substring(0, dateString.length - 5)
    };
    const queryString = QueryString.stringify(query);
    const response = await fetch(TRAFFIC_API_URL+'?'+queryString);
    const jsonData: WeatherDTO = await response.json();
    setLocations(jsonData.area_metadata);
  }

  useEffect(() => {
    loadTraffic(date);
    loadWeatherAndLocation(date);
  }, [date]);
  console.log(locations);

  const locationOptions = useMemo(() => locations?.map(l => ({
    value: l.name, display: l.name,
  })) || [], [locations]);

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
        <div>
          <DatePicker onChange={onChange} className={styles.input} size="large" />
        </div>
        <div>
          <TimePicker onChange={onTimeChange} className={styles.input} size="large" />
        </div>
        <div>
          <Select
            size="large"
            onChange={handleChange}
            options={locationOptions}
            disabled={!date}
            className={styles.input}
          />
        </div>
      </div>
    </main>
  );
}

export default Page;
