export const [acoreServiceRoot, sshServiceHost] = (() => {
  const sshUrl = window.WEBSSH2_LOCATION || 'http://'+window.location.host+':30010'
  const acoreUrl = window.ACORE_LOCATION || window.location.origin+'/acore'
  return [acoreUrl, sshUrl];
})();

// get params from page url query parameters
export const [lessonSlug, lessonStage, collectionSlug, lessonId] = (() => {
  const url = new URL(window.location.href);
  const slug = url.searchParams.get("lessonSlug");
  const stage = url.searchParams.get("lessonStage");
  const collection = url.searchParams.get("collectionSlug");

  // This is a deprecated field, but we're still gathering it so we can see if someone is attempting to
  // use it using an old URL. This will allow us to redirect them back to the catalog to find the right URL.
  const lessonId = url.searchParams.get("lessonId");

  return [
    slug && slug.length > 0 ? slug : null,
    stage && stage.length > 0 ? parseInt(stage) : null,
    collection && collection.length > 0 ? collection : null,
    lessonId && lessonId.length > 0 ? parseInt(lessonId) : null,
  ]
})();
