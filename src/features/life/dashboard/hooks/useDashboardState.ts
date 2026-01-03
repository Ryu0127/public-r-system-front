import { useEffect } from 'react';
import {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
  ScheduleItem,
  SwitchBotDevice,
  mockCurrentWeather,
  mockDailyWeather,
  mockHourlyWeather,
  mockSchedules,
  mockSwitchBotDevices,
} from '../data/mockDashboardData';

export interface DashboardState {
  config: {
    isLoading: boolean;
  };
  data: {
    currentWeather: CurrentWeather;
    dailyWeather: DailyWeather[];
    hourlyWeather: HourlyWeather[];
    schedules: ScheduleItem[];
    devices: SwitchBotDevice[];
  };
}

export interface DashboardActions {
  toggleDevice: (deviceId: string) => void;
  changeAirconMode: (deviceId: string, mode: string) => void;
  changeAirconTemp: (deviceId: string, temp: number) => void;
}

export const useDashboardState = (
  state: DashboardState,
  setState: React.Dispatch<React.SetStateAction<DashboardState>>
): { actions: DashboardActions } => {
  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: true,
        },
      }));

      // モックデータを読み込み
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          config: {
            ...prev.config,
            isLoading: false,
          },
          data: {
            currentWeather: mockCurrentWeather,
            dailyWeather: mockDailyWeather,
            hourlyWeather: mockHourlyWeather,
            schedules: mockSchedules,
            devices: mockSwitchBotDevices,
          },
        }));
      }, 500);
    };

    loadData();
  }, [setState]);

  const toggleDevice = (deviceId: string) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        devices: prev.data.devices.map((device) =>
          device.id === deviceId ? { ...device, isOn: !device.isOn } : device
        ),
      },
    }));
  };

  const changeAirconMode = (deviceId: string, mode: string) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        devices: prev.data.devices.map((device) =>
          device.id === deviceId
            ? { ...device, mode: mode as 'cool' | 'heat' | 'auto' | 'dry' | 'fan' }
            : device
        ),
      },
    }));
  };

  const changeAirconTemp = (deviceId: string, temp: number) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        devices: prev.data.devices.map((device) =>
          device.id === deviceId ? { ...device, targetTemp: temp } : device
        ),
      },
    }));
  };

  const actions: DashboardActions = {
    toggleDevice,
    changeAirconMode,
    changeAirconTemp,
  };

  return { actions };
};
