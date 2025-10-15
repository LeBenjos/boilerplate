import './styles/style.scss';

import InitCommand from './experiences/commands/InitCommand';
import Experience from './experiences/Experience';
import Ticker from './experiences/tools/Ticker';

//#region Commands
//
InitCommand.begin();
//
//#endregion

Experience.Init();
const experience = new Experience();
Ticker.Add(experience);
