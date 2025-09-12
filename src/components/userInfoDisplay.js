import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import '../assets/css/userInfoDisplay.css';

const UserInfoDisplay = ({ name, lastname }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('صبح بخیر');
        } else if (hour >= 12 && hour < 17) {
            setGreeting('ظهر بخیر');
        } else if (hour >= 17 && hour < 20) {
            setGreeting('عصر بخیر');
        } else {
            setGreeting('شب بخیر');
        }
    }, [currentTime]);

    if (!name || !lastname) {
        return null;
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    return (
        <div className="user-info-display">
            <div className="user-info-card">
                <div className="user-info-header">
                    <div className="user-avatar">
                        <FiUser />
                    </div>
                    <div className="greeting-text">
                        <h3>{greeting}</h3>
                        <h2>{name} {lastname}</h2>
                    </div>
                </div>
                
                <div className="user-info-details">
                    <div className="info-item time-item">
                        <div className="info-icon">
                            <FiClock />
                        </div>
                        <div className="info-content">
                            <span className="info-label">زمان فعلی</span>
                            <span className="info-value">{formatTime(currentTime)}</span>
                        </div>
                    </div>
                    
                    <div className="info-item date-item">
                        <div className="info-icon">
                            <FiCalendar />
                        </div>
                        <div className="info-content">
                            <span className="info-label">تاریخ امروز</span>
                            <span className="info-value">{formatDate(currentTime)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="user-info-footer">
                    <div className="welcome-message">
                        به فروشگاه فیگورهای انیمه و غیر انیمه خوش آمدید!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoDisplay;
