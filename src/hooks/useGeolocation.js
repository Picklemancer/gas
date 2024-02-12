import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
  });

  // const optionsRef = useRef(options);

  useEffect(() => {
    const onEvent = ({ coords, timestamp }) =>
      setState({
        loading: false,
        error: null,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
      });

    const onEventError = (error) =>
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));

    const options = {
      enableHighAccuracy: true,
      // timeout: Infinity,
      // maximumAge: 0,
      // onlyOnce: false,
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);

    if (options.onlyOnce) return;

    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};

export default useGeolocation;
