"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

export default function AIChartRenderer({ chartData, chartType }) {
    if (!chartData || !chartData.length) return null;

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'candlestick':
                // Recharts doesn't have a native candlestick, so we simulate it via ComposedChart with Bar (range) and Line (trend).
                // Assuming data is { name, high, low, open, close }
                // For simplicity in a basic AI report, we render it as an area or custom bar.
                // We'll use a ComposedChart to show the high/low range and the open/close.
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="range" fill="#6366f1" radius={[4, 4, 0, 0]} name="Volatility" />
                            <Line type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2} name="Closing Value" />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            background: 'var(--surface)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            margin: '2rem 0'
        }}>
            {renderChart()}
        </div>
    );
}
