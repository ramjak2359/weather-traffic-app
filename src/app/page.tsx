"use client";
import {useEffect, useMemo, useState} from "react";
import styles from './page.module.scss'
import "react-datepicker/dist/react-datepicker.css";
import {Card, DatePicker, DatePickerProps, Image, Select, TimePicker} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCarRear,
  faCloud,
  faCloudBolt,
  faCloudRain,
  faCloudShowersHeavy, faMoon,
  faQuestion
} from "@fortawesome/free-solid-svg-icons";
import {AreaMetadata, Camera, Forecast, TrafficDTO, WeatherDTO} from "@/types";
import QueryString from 'query-string';
import dayjs from "dayjs";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faSun} from "@fortawesome/free-regular-svg-icons";

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
  const [weathers, setWeathers] = useState<Forecast[]>()
  const loadWeatherAndLocation = async (dateParam: Date) => {
    const TRAFFIC_API_URL = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
    const dateString = dateParam.toISOString()
    const query = {
      date_time: dateString.substring(0, dateString.length - 5)
    };
    const queryString = QueryString.stringify(query);
    const response = await fetch(TRAFFIC_API_URL+'?'+queryString);
    const jsonData: WeatherDTO = await response.json();
    jsonData.area_metadata?.length && setLocations(jsonData.area_metadata);
    jsonData.items?.length && setWeathers(jsonData.items[0].forecasts)
  }

  useEffect(() => {
    loadTraffic(date);
    loadWeatherAndLocation(date);
  }, [date]);

  const locationOptions = useMemo(() => locations?.map(l => ({
    value: l.name, display: l.name,
  })) || [], [locations]);

  const [selectedLocation, setSelectedLocation] = useState();
  const selectedLocationDetail = useMemo(() => {
    const metadata = locations?.find(l => l.name === selectedLocation);
    const weather = weathers?.find(w => w.area === selectedLocation);

    const nullCamera = { distance: Number.MAX_SAFE_INTEGER, camera: {
        timestamp: '',
        image: '',
        location: {
          longitude: 0,
          latitude: 0,
        },
        camera_id: '',
        image_metadata: {},
      } }
    const cameraData = metadata && cameras?.reduce((nearest, camera) => {
      const latDist = Math.abs(camera.location.latitude - metadata.label_location.latitude)
      const longDist = Math.abs(camera.location.longitude - metadata.label_location.longitude)
      const distance = Math.sqrt((Math.pow(latDist, 2) + Math.pow(longDist, 2)))

      if (distance < nearest.distance)
        return { distance, camera }
      else
        return nearest
    }, nullCamera)
    return { metadata, weather, cameraData };
  }, [selectedLocation, weathers, locations]);

  const checkIsDisabled = (current: dayjs.Dayjs) => {
    return current && current > dayjs().add(1, 'days')
  };

  const getWeatherIcon = (weather: string): IconProp => {
    if (weather.match(/Thundery/)) {
      return faCloudBolt
    }
    if (weather.match(/Shower/)) {
      return faCloudShowersHeavy
    }
    if (weather.match(/Rain/)) {
      return faCloudRain
    }
    if (weather.match(/Cloudy/)) {
      return faCloud
    }
    if (weather.match(/Fair/) && weather.match(/Day/)) {
      return faSun
    }
    if (weather.match(/Fair/) && weather.match(/Day/)) {
      return faMoon
    }
    return faQuestion
  }

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

      <div className={styles.center} />

      <div className={styles.grid}>
        <div>
          <DatePicker onChange={onChange} className={styles.picker} size="large" disabledDate={checkIsDisabled} />
          <TimePicker onChange={onTimeChange} className={styles.picker} size="large" />
        </div>
        <div>
          <Select
            size="large"
            onChange={setSelectedLocation}
            options={locationOptions}
            disabled={!date}
            className={styles.select}
          />
        </div>
        <div>
          <Card style={{ width: '100%' }}>
            {
              selectedLocationDetail.weather && <>
                <div><FontAwesomeIcon icon={getWeatherIcon(selectedLocationDetail.weather.forecast)} size="2x"  /></div>
                <p>{selectedLocationDetail.weather.forecast}</p>
              </>
            }
          </Card>
        </div>
        <div>
          {selectedLocationDetail.cameraData && <Image
            src={selectedLocationDetail.cameraData?.camera.image}
            className={styles.trafficImg}
          />
          }
        </div>
      </div>
    </main>
  );
}

export default Page;
