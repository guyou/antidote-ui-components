import { html } from 'lit-html';
import { component, useContext} from 'haunted';
import { AllLessonContext, LessonFilteringContext } from "../contexts.js";

function doFiltering(lessons, filteringState) {
  const filterEntries = Object.entries(filteringState);

  return lessons.filter((lesson) => {
    return filterEntries.reduce((acc, [filterProp, filterValue]) => {
      if (filterValue !== null) {
        if (filterProp === 'Tags') {
          return acc && filterValue.every((tag) => (lesson.Tags || []).includes(tag));
        } else if (filterProp === 'searchString') {
          return acc && lesson.LessonName.toLowerCase().indexOf(filterValue) > -1;
        } else {
          return acc && lesson[filterProp] === filterValue;
        }
      } else {
        return acc;
      }
    }, true);
  });
}

function CatalogTable() {
  const allLessonRequest = useContext(AllLessonContext);
  const [filteringState] = useContext(LessonFilteringContext);
  const lessons = allLessonRequest.succeeded
    ? doFiltering(allLessonRequest.data.lessons, filteringState)
    : [];

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <table class="catalog">
      <thead>
      <tr>
        <th>Lesson</th>
        <th>Description</th>
        <th>Tags</th>
      </tr>
      </thead>
      <tbody>
      ${lessons.map((lesson) => html`
        <tr>
          <td class="title">
            <a href="/labs/?lessonId=${lesson.LessonId}&lessonStage=1">
              ${lesson.LessonName}
            </a>
          </td>
          <td>${lesson.Description}</td>
          <td class="tags">
          ${(lesson.Tags || []).map((tag) => html`
            <span class="tag">${tag}</span>
          `)}
          </td>
        </tr>
      `)}
      </tbody>
    </table>
    `;
}

customElements.define('antidote-catalog-table', component(CatalogTable));

export default CatalogTable;
