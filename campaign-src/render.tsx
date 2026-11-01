import {renderToString} from 'react-dom/server';
import {RemodelingLanding} from './components/remodeling-landing';
export function render(kind:'kitchen'|'bathroom'){return renderToString(<RemodelingLanding kind={kind}/>);}
