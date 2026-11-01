import {hydrateRoot} from 'react-dom/client';
import {RemodelingLanding} from './components/remodeling-landing';
const root=document.querySelector<HTMLElement>('[data-nova-campaign]');
if(root)hydrateRoot(root,<RemodelingLanding kind={root.dataset.novaCampaign==='bathroom'?'bathroom':'kitchen'}/>);
