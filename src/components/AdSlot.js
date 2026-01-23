'use client';

import React from 'react';

const AdSlot = ({ type, className = '' }) => {
    const styles = {
        horizontal: {
            width: '100%',
            maxWidth: '800px',
            height: '90px',
        },
        'small-horizontal': {
            width: '320px',
            height: '50px',
        },
        vertical: {
            width: '160px',
            height: '600px',
        },
    };

    const selectedStyle = styles[type] || styles.horizontal;

    return (
        <div
            className={`ad-slot ad-slot-${type} ${className}`}
            style={{
                ...selectedStyle,
                backgroundColor: 'rgba(30, 41, 59, 0.5)', // surface color with alpha
                border: '1px dashed var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                margin: '0 auto', // Center horizontally
            }}
        >
            <span>Ad Space ({type})</span>
        </div>
    );
};

export default AdSlot;
