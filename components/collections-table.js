import { html } from 'lit-html';
import { component, useContext} from 'haunted';
import { AllCollectionContext, CollectionFilteringContext } from "../contexts.js";
import getCopyReader from '../helpers/copy';

function doFiltering(collections, filteringState) {
  const filterEntries = Object.entries(filteringState);

  return collections.filter((collection) => {
    return filterEntries.reduce((acc, [filterProp, filterValue]) => {
      if (filterValue !== null) {
        if (filterProp === 'searchString') {
          return acc && collection.Title.toLowerCase().indexOf(filterValue) > -1;
        } else {
          return acc && collection[filterProp] === filterValue;
        }
      } else {
        return acc;
      }
    }, true);
  });
}

function CollectionsTable() {
  const copy = getCopyReader(this);
  const allCollectionRequest = useContext(AllCollectionContext);
  const [filteringState] = useContext(CollectionFilteringContext);
  const collections = allCollectionRequest.succeeded
    ? doFiltering(allCollectionRequest.data.collections, filteringState)
    : [];

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <table class="catalog">
      <thead>
      <tr>
        <th>${copy('collection.table.column.name.label')}</th>
        <th>${copy('collection.table.column.description.label')}</th>
      </tr>
      </thead>
      <tbody>
      ${collections.map((collection) => html`
        <tr>
          <td class="title">
            <a href="view.html?collectionId=${collection.Id}">
              ${collection.Title}
            </a>
          </td>
          <td>${collection.BriefDescription}</td>
        </tr>
      `)}
      </tbody>
    </table>
    `;
}

customElements.define('antidote-collections-table', component(CollectionsTable));

export default CollectionsTable;
