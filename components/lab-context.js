import '../contexts.js';
import { html } from 'lit-html';
import { lessonSlug, lessonStage, syringeServiceRoot, getSessionId} from "../helpers/page-state.js";
import { component, useContext} from 'haunted';
import useFetch from '../helpers/use-fetch.js';
import usePollingRequest from '../helpers/use-polling-request.js';
import getL8nReader from '../helpers/l8n';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function derivePresentationsFromLessonDetails(detailsRequest) {
  const endpoints = detailsRequest.succeeded ? detailsRequest.data.LiveEndpoints : [];

  return Object.values(endpoints).reduce((acc, ep) => {
    if (ep.Presentations) {
      ep.Presentations.forEach((pres) => {
        const name = ep.Presentations.length > 1
            ? `${ep.Name}-${pres.Name}`
            : `${ep.Name}`;

        acc.push({
          name,
          endpoint: ep.Name,
          type: pres.Type,
          host: ep.Host,
          port: pres.Port,
        });
      });
    }

    return acc;
  }, []);
}

customElements.define('antidote-lab-context', component(function AntidoteLabContext() {
  const l8n = getL8nReader(this);
  const lessonRequest = useFetch(`${syringeServiceRoot}/exp/lesson/${lessonSlug}`);
  const liveLessonDetailRequest = usePollingRequest({
    initialRequestURL: `${syringeServiceRoot}/exp/livelesson`,
    initialRequestOptions: {
      method: 'POST',
      body: { lessonSlug, lessonStage }
    },
    progressRequestURL: ({id}) => `${syringeServiceRoot}/exp/livelesson/${id}`,
    isProgressComplete: ({LiveLessonStatus}) => LiveLessonStatus === 'READY',
  });
  const tabletBreakpointCSSVar = document.documentElement.style.getPropertyValue('--tablet-max-width');
  const tabletBreakpoint = parseInt(tabletBreakpointCSSVar, 10) || 1024;
  const isMobileSizedWindow = window.innerWidth < tabletBreakpoint;
  const presentations = derivePresentationsFromLessonDetails(liveLessonDetailRequest);
  const presentationTabs = presentations ? presentations.map((p, i) => ({
    id: p.name.toLowerCase(),
    label: p.name,
    pres: p,
    selected: isMobileSizedWindow ? false : i === 0
  })) : [];
  const tabs = [
    // this is hardcoded, ideally this would be assembled by the components reading their slots &
    // merging them together to make a config
    {
      id: 'mobile-guide',
      label: l8n('lab.tab.switcher.guide.tab.label'),
      selected: isMobileSizedWindow // start with the guide tab selected if the page is narrow enough to need it
    },
    ...presentationTabs
  ];

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <antidote-lesson-context-provider .value=${lessonRequest}>
    <antidote-live-lesson-details-context-provider .value=${liveLessonDetailRequest}>
    <antidote-lab-tabs-context-provider .value=${tabs}>
        <slot></slot>
    </antidote-lab-tabs-context-provider>      
    </antidote-live-lesson-details-context-provider>      
    </antidote-lesson-context-provider>
  `
}));
