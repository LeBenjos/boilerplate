import './styles/style.scss';

import InitCommand from './experiences/commands/InitCommand';
import Experience from './experiences/Experience';
import Ticker from './experiences/tools/Ticker';

//#region Commands
//
InitCommand.begin();
//
//#endregion

const canvas = document.createElement('canvas')!;
canvas.id = 'webgl';
document.querySelector("#app")!.appendChild(canvas);

const experience = new Experience(canvas);
Ticker.Add(experience);
