// Traffic
export interface TrafficDTO {
  items: Traffic[];
}

export interface Traffic {
  timestamp: string
  cameras: Camera[]
}

export interface Camera {
  timestamp: string
  image: string
  location: Location
  camera_id: string
  image_metadata: ImageMetadata
}

export interface Location {
  latitude: number
  longitude: number
}

export interface ImageMetadata {
  height: number
  width: number
  md5: string
}

// Weather
export interface WeatherDTO {
  area_metadata: AreaMetadata[]
  items: Item[]
  api_info: ApiInfo
}

export interface AreaMetadata {
  name: string
  label_location: LabelLocation
}

export interface LabelLocation {
  latitude: number
  longitude: number
}

export interface Item {
  update_timestamp: string
  timestamp: string
  valid_period: ValidPeriod
  forecasts: Forecast[]
}

export interface ValidPeriod {
  start: string
  end: string
}

export interface Forecast {
  area: string
  forecast: string
}

export interface ApiInfo {
  status: string
}
