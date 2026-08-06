/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeviceState } from '../types';
import { 
  Cpu, 
  Wind, 
  Flame, 
  Battery, 
  BatteryCharging, 
  Thermometer, 
  Droplets, 
  Wifi, 
  WifiOff, 
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface HardwareSimulatorProps {
  deviceState: DeviceState;
  setDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
}

export default function HardwareSimulator({ deviceState, setDeviceState }: HardwareSimulatorProps) {
  const handleTogglePower = () => {
    setDeviceState(prev => {
      const nextPower = !prev.isPowerOn;
      return {
        ...prev,
        isPowerOn: nextPower,
        fanSpeed: nextPower ? 'MEDIUM' : 'OFF',
        heatLevel: nextPower ? 'LOW' : 'OFF'
      };
    });
  };

  const handleSliderChange = (key: keyof DeviceState, value: any) => {
    setDeviceState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDiagnosticToggle = (key: keyof DeviceState['diagnostics']) => {
    setDeviceState(prev => ({
      ...prev,
      diagnostics: {
        ...prev.diagnostics,
        [key]: !prev.diagnostics[key]
      }
    }));
  };

  const triggerReset = () => {
    setDeviceState({
      isConnected: true,
      isPowerOn: false,
      fanSpeed: 'OFF',
      heatLevel: 'OFF',
      mode: 'Normal',
      batteryLevel: 80,
      temperature: 24,
      moisturePercent: 85,
      timerMinutes: 0,
      selectedTimer: 'none',
      firmwareVersion: 'v2.1.0',
      isCharging: false,
      deviceName: 'DryNest-X9',
      diagnostics: {
        fanOk: true,
        heaterOk: true,
        sensorsOk: true,
        filterOk: true
      }
    });
  };

  // Calculate fan spinning speed class based on state
  const getFanSpinClass = () => {
    if (!deviceState.isPowerOn || deviceState.fanSpeed === 'OFF') return '';
    switch (deviceState.fanSpeed) {
      case 'LOW': return 'animate-[spin_4s_linear_infinite]';
      case 'MEDIUM': return 'animate-[spin_2s_linear_infinite]';
      case 'HIGH': return 'animate-[spin_1s_linear_infinite]';
      case 'TURBO': return 'animate-[spin_0.3s_linear_infinite]';
      default: return '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white h-full flex flex-col shadow-2xl justify-between" id="hardware-simulator">
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
              ⚡ Hardware Prototype Unit
            </span>
            <h2 className="text-xl font-bold font-sans mt-2 tracking-tight text-white flex items-center gap-1.5">
              DryNest Container <span className="text-xs font-mono text-slate-400">{deviceState.deviceName}</span>
            </h2>
          </div>
          <button 
            onClick={triggerReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 rounded-lg border border-slate-700"
            title="Reset Simulator Settings"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* 3D Container Blueprint Illustration */}
        <div className="relative h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center mb-6">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,37,66,1),rgba(0,0,0,0))] opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.2)_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Hardware visual */}
          <div className="relative w-20 h-32 flex flex-col items-center justify-between border-2 border-slate-700 rounded-xl px-2 py-3 bg-slate-900/60 shadow-xl">
            {/* Lid with motor fan */}
            <div className={`w-16 h-8 rounded-lg border border-slate-600 bg-slate-800/80 flex flex-col items-center justify-center relative ${deviceState.isPowerOn ? 'border-teal-500/50 shadow-[0_0_15px_rgba(34,193,195,0.25)]' : ''}`}>
              <Wind size={16} className={`text-slate-400 ${getFanSpinClass()} ${deviceState.isPowerOn ? 'text-teal-400' : ''}`} />
              <span className="text-[7px] font-mono mt-0.5 text-slate-500">BRUSHLESS</span>
              {/* Thermal Core */}
              {deviceState.isPowerOn && deviceState.heatLevel !== 'OFF' && (
                <div className="absolute -bottom-1 w-6 h-0.5 bg-amber-500 animate-pulse" />
              )}
            </div>

            {/* Simulated garment inside */}
            <div className="flex-1 flex items-center justify-center w-full my-1 relative">
              {/* Humidity visualizer */}
              <div 
                className="absolute inset-x-2 rounded-md bg-blue-500/20 transition-all duration-500"
                style={{ height: `${deviceState.moisturePercent}%`, bottom: 0, opacity: deviceState.moisturePercent / 120 }}
              />
              
              {/* Dynamic Airflow particles */}
              {deviceState.isPowerOn && (
                <div className="absolute inset-0 flex flex-col justify-around py-2 overflow-hidden pointer-events-none">
                  <div className="w-1 h-1 bg-teal-400/60 rounded-full mx-auto animate-bounce" />
                  <div className="w-1 h-1 bg-teal-300/40 rounded-full mx-3 animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full mx-6 animate-bounce" />
                </div>
              )}

              <span className="text-[9px] font-semibold font-mono text-slate-400 z-10 select-none text-center bg-slate-950/40 px-1 py-0.5 rounded">
                👕 {deviceState.moisturePercent}% Wet
              </span>
            </div>

            {/* Base Ventilation and Battery Core */}
            <div className="w-16 h-6 rounded-md border border-slate-700 bg-slate-950 flex justify-between px-1.5 items-center">
              <div className="flex gap-0.5">
                <span className="w-1 h-2 bg-slate-700 rounded-sm block"></span>
                <span className="w-1 h-2 bg-slate-700 rounded-sm block"></span>
                <span className="w-1 h-2 bg-slate-700 rounded-sm block"></span>
              </div>
              <span className="text-[7px] text-slate-500 font-mono">PD CORE</span>
              <div className="flex items-center gap-0.5">
                {deviceState.isCharging ? (
                  <Zap size={6} className="text-yellow-400 animate-bounce" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${deviceState.batteryLevel < 20 ? 'bg-rose-500 animate-ping' : 'bg-green-500'}`} />
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Thermometer size={10} className="text-amber-500" /> {deviceState.temperature}°C
            </span>
            <span className="flex items-center gap-1">
              <Battery size={10} className="text-green-500" /> {deviceState.batteryLevel}%
            </span>
          </div>
        </div>

        {/* Physical Controls sliders */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Sensor Adjustments
          </h3>

          {/* Moisture Control */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Droplets size={12} className="text-blue-400" /> Moisture / Humidity
              </span>
              <span className="text-blue-400 font-bold">{deviceState.moisturePercent}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={deviceState.moisturePercent}
              onChange={(e) => handleSliderChange('moisturePercent', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Temperature Control */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Thermometer size={12} className="text-orange-400" /> Internal Temperature
              </span>
              <span className="text-orange-400 font-bold">{deviceState.temperature}°C</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="55" 
              value={deviceState.temperature}
              onChange={(e) => handleSliderChange('temperature', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Battery Control */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Battery size={12} className="text-green-400" /> Battery Capacity
              </span>
              <span className="text-green-400 font-bold">{deviceState.batteryLevel}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={deviceState.batteryLevel}
              onChange={(e) => handleSliderChange('batteryLevel', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Hardware Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs cursor-pointer hover:bg-slate-800 transition-all select-none">
              <span className="flex items-center gap-1.5">
                <Zap size={14} className={deviceState.isCharging ? 'text-yellow-400 animate-pulse' : 'text-slate-500'} />
                USB-C Charging
              </span>
              <input 
                type="checkbox" 
                checked={deviceState.isCharging}
                onChange={(e) => handleSliderChange('isCharging', e.target.checked)}
                className="rounded text-teal-500 focus:ring-0 cursor-pointer bg-slate-900 border-slate-700 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs cursor-pointer hover:bg-slate-800 transition-all select-none">
              <span className="flex items-center gap-1.5">
                {deviceState.isConnected ? (
                  <Wifi size={14} className="text-teal-400" />
                ) : (
                  <WifiOff size={14} className="text-rose-500" />
                )}
                BLE Broadcast
              </span>
              <input 
                type="checkbox" 
                checked={deviceState.isConnected}
                onChange={(e) => handleSliderChange('isConnected', e.target.checked)}
                className="rounded text-teal-500 focus:ring-0 cursor-pointer bg-slate-900 border-slate-700 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Diagnostics & Fault Injectors */}
        <div className="space-y-3 mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
            Diagnostics & Fault Injection
            <span className="text-[9px] font-mono text-slate-500">Inject Malfunctions</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDiagnosticToggle('filterOk')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all active:scale-95 ${
                deviceState.diagnostics.filterOk 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold'
              }`}
            >
              <span>Air Filter Status</span>
              {deviceState.diagnostics.filterOk ? <CheckCircle size={12} className="text-teal-400" /> : <AlertTriangle size={12} className="text-rose-400" />}
            </button>

            <button
              onClick={() => handleDiagnosticToggle('fanOk')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all active:scale-95 ${
                deviceState.diagnostics.fanOk 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold'
              }`}
            >
              <span>Intake Fan motor</span>
              {deviceState.diagnostics.fanOk ? <CheckCircle size={12} className="text-teal-400" /> : <AlertTriangle size={12} className="text-rose-400" />}
            </button>

            <button
              onClick={() => handleDiagnosticToggle('heaterOk')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all active:scale-95 ${
                deviceState.diagnostics.heaterOk 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold'
              }`}
            >
              <span>Heating Core</span>
              {deviceState.diagnostics.heaterOk ? <CheckCircle size={12} className="text-teal-400" /> : <AlertTriangle size={12} className="text-rose-400" />}
            </button>

            <button
              onClick={() => handleDiagnosticToggle('sensorsOk')}
              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all active:scale-95 ${
                deviceState.diagnostics.sensorsOk 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold'
              }`}
            >
              <span>Sensors Calibration</span>
              {deviceState.diagnostics.sensorsOk ? <CheckCircle size={12} className="text-teal-400" /> : <AlertTriangle size={12} className="text-rose-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Manual Hardware Control Toggles */}
      <div className="mt-6 border-t border-slate-800 pt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Hardware Power Switch</span>
          <span className="text-xs font-bold text-slate-200">
            {deviceState.isPowerOn ? 'Active Operating Cycle' : 'Standby Mode'}
          </span>
        </div>
        <button
          onClick={handleTogglePower}
          disabled={deviceState.batteryLevel <= 0}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
            deviceState.isPowerOn 
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50' 
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-950/50'
          }`}
        >
          {deviceState.isPowerOn ? 'SHUTDOWN' : 'BOOT CONTAINER'}
        </button>
      </div>
    </div>
  );
}
