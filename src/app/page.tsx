"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { parseDate } from "@internationalized/date";
import { Calendar } from "@nextui-org/calendar";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
// @ts-ignore
import AnalogClock from "analog-clock-react";
import { Spinner } from "@nextui-org/spinner";

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mainWeather, setMainWeather] = useState("");
  const [descWeather, setDescWeather] = useState("");
  const [iconSrc, setIconSrc] = useState("");
  const [userLocation, setUserLocation] = useState({
    isLoaded: false,
    isAllowed: true,
    latitude: 0,
    longitude: 0,
  });
  const [currentTime, setCurrentTime] = useState("");
  const clockOptions = {
    width: "90px",
    border: true,
    borderColor: "#2e2e2e",
    baseColor: "#17a2b8",
    centerColor: "#459cff",
    centerBorderColor: "#ffffff",
    handColors: {
      second: "#d81c7a",
      minute: "#ffffff",
      hour: "#ffffff",
    },
  };
  useEffect(() => {
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const twelveHourFormat = hours % 12 || 12;
    const minutesPadded = minutes < 10 ? "0" + minutes : minutes;
    setCurrentTime(`${twelveHourFormat}:${minutesPadded} ${ampm}`);
  }, [currentDate]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            isLoaded: true,
            isAllowed: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(`Error: ${error.message}`);
          if (error.code === error.PERMISSION_DENIED) {
            setUserLocation({
              isLoaded: true,
              isAllowed: false,
              latitude: 0,
              longitude: 0,
            });
          }
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API}`
      );
      const data = await response.json();
      setWeatherData(data);
    };
    fetchWeatherData();
  }, [userLocation]);

  useEffect(() => {
    if (Object.keys(weatherData).length < 1) {
      return;
    }
    console.log(weatherData);
    setMainWeather(weatherData.weather[0].main);
    setDescWeather(weatherData.weather[0].description);
    setIconSrc(
      `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`
    );
  }, [weatherData]);

  return (
    <main className="flex justify-center items-center h-screen">
      <section className="flex flex-col space-y-20">
        <h1 className="flex justify-center text-2xl font-bold">
          Sample Weather Tool
        </h1>
        <div className="flex justify-center space-x-12 items-center">
          <Card className="w-64 h-72 items-center py-10">
            <div className="h-36 flex flex-col items-center justify-center">
              {userLocation.isLoaded ? (
                userLocation.isAllowed ? (
                  <div className="flex flex-col space-y-16 mt-8">
                    <div className="flex justify-center text-center">
                      <div className="flex flex-col">
                        <img className="w-24" src={iconSrc} />
                        <span>{mainWeather}</span>
                        <span>{descWeather}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-start overflow-clip hover:overflow-visible hover:justify-center max-w-36">
                        <span>Latitude:</span>
                        <span>{userLocation.latitude}</span>
                      </div>
                      <div className="flex justify-start overflow-clip hover:overflow-visible hover:justify-center max-w-36">
                        <span>Longitude:</span>
                        <span>{userLocation.longitude}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col text-center">
                    <span>Permission Denied</span>
                    <span>Allow access for geolocation-based weather</span>
                  </div>
                )
              ) : (
                <div className="flex flex-col space-y-8 mt-8">
                  <span>Loading Weather...</span>
                  <Spinner />
                </div>
              )}
            </div>
          </Card>

          <Card className="flex justify-center w-64 h-72 items-center">
            <div className="h-48 flex flex-col items-center justify-center">
              <div className="py-2">
                <AnalogClock {...clockOptions} />
              </div>
              <div className="py-2">
                <span className="text-2xl">{currentTime}</span>
              </div>
            </div>
          </Card>
          <Calendar
            className="h-72"
            color="danger"
            aria-label="Date (Uncontrolled)"
            defaultValue={parseDate(currentDate.toISOString().split("T")[0])}
          />
        </div>
        <span className="flex justify-center text-lg text-gray-700">
          Made by Aran8276 / Zahran SMKN6 Malang
        </span>
      </section>
    </main>
  );
}
