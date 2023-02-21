import 'react-circular-progressbar/dist/styles.css';
import PauseButton from './components/PauseButton';
import PlayButton from './components/PlayButton';
import SettingsButton from './components/SettingsButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import soundFile from '../src/assets/despertador.mp3'

function Timer() {
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work');
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [playAlert, setPlayAlert] = useState(false);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode)

    const [workColor] = useState('#ba4949');
    const [breakColor] = useState('#38858a');

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current)
    }

    useEffect(() => {
        if (mode === 'work') {
          document.body.style.backgroundColor = workColor;
        } else if (mode === 'break') {
          document.body.style.backgroundColor = breakColor;
        }
      }, [mode, workColor, breakColor]);

    useEffect(() => {

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

        setMode(nextMode);
        modeRef.current = nextMode;

        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;

        if (nextMode === 'break') {
            setPlayAlert(true);
        }
       
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current)

    function initTimer() {
        setSecondsLeft(settingsInfo.workMinutes * 60);
    }

        initTimer()

       const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
               return switchMode()
            }

            tick();
        }, 1000)

        return () => clearInterval(interval);
    }, [settingsInfo]);

    useEffect(() => {
        if (playAlert) {
          const audio = new Audio(soundFile);
          audio.volume = 0.05;
          audio.currentTime = 0.1;
          audio.play();
          setPlayAlert(false);
        }
      }, [playAlert]);

    const totalSeconds = mode === 'work' 
    ? settingsInfo.workMinutes * 60 
    : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100) ;

    return (

        <div>
            <CircularProgressbarWithChildren value={percentage} 
           
                strokeWidth={1}
                styles={buildStyles({
                    textColor:'#fff',
                    pathColor:mode === 'work' ? '#fff' : '#ddd',
                    trailColor:'rgba(255,255,255,0.2)',
                    // strokeLinecap: 'butt',
                })}>
                    <div style={{marginTop:'20px'}}>
                        {isPaused 
                        ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false}}/> 
                        : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true}}/>}
                    </div>
            
            </CircularProgressbarWithChildren>
        
                <div style={{marginTop: '20px'}}>
                    <SettingsButton onClick={() => settingsInfo.setShowSettings(true)}/>
                </div>

        </div>
    )
}

export default Timer;