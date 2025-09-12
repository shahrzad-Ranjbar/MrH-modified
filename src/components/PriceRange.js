import React from 'react';
import "./../assets/css/PriceRange.css"
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const PriceRangeSlider = ({ value, rangeSelector, min = 0, max = 50000000, step = 100000 }) => {
    const [minVal, maxVal] = value || [min, max];

    const onMinChange = (e) => {
        const next = clamp(Number(e.target.value), min, maxVal - step);
        rangeSelector(e, [next, maxVal]);
    };

    const onMaxChange = (e) => {
        const next = clamp(Number(e.target.value), minVal + step, max);
        rangeSelector(e, [minVal, next]);
    };

    return (
        <div className='range-in' style={{ minWidth: 260 }}>
            <div id="range-slider" style={{ marginBottom: 8 }}>محدوده قیمت:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontSize: 12 }}>حداقل</label>
                    <input 
                        type="range" 
                        min={min} 
                        max={max} 
                        step={step} 
                        value={minVal} 
                        onChange={onMinChange} 
                        className="range-slider" 
                    />
                    <input 
                        type="number" 
                        value={minVal} 
                        onChange={onMinChange} 
                        style={{ 
                            padding: 6, 
                            borderRadius: 6, 
                            border: '1px solid var(--border)', 
                            background: 'var(--bg)', 
                            color: 'var(--text)' 
                        }} 
                    />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontSize: 12 }}>حداکثر</label>
                    <input 
                        type="range" 
                        min={min} 
                        max={max} 
                        step={step} 
                        value={maxVal} 
                        onChange={onMaxChange} 
                        className="range-slider" 
                    />
                    <input 
                        type="number" 
                        value={maxVal} 
                        onChange={onMaxChange} 
                        style={{ 
                            padding: 6, 
                            borderRadius: 6, 
                            border: '1px solid var(--border)', 
                            background: 'var(--bg)', 
                            color: 'var(--text)' 
                        }} 
                    />
                </div>
            </div>
            <div className='res-range' style={{ marginTop: 8 }}>
                محدوده انتخابی شما بین {minVal.toLocaleString()} و {maxVal.toLocaleString()} تومان است
            </div>
        </div>
    );
};

export default PriceRangeSlider;
