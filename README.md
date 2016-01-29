# O365-New-Intranet
Building a loosely coupled Intranet 

This sample is a proof of concept to implement a loosely coupled intranet which sperates the content which is stored in SharEPoint online form the custom presneation layer

##Building Blocks of the sample
1. Azure AD App:
used to define the delegated permission of our Nodejs App , authentication is done via adal.js
2. Express App with custom ImageHandler router
  * Image Handler Router handles caching the images from SharePoint Online to a local folder, stores the cached image url in a Redis Cache.
  
    ``` JavaScript
    //in server.js file
    var images=require('./imageHandler');
    app.use('*/images/*',images);
    ```   
    For this proof of concept the access token is sent from angular app to the Nodejs as plain text , it's not recommended to do that this is just to simplify the POC
3. AngularJS app
  * Directives:
    * Search Results: execute a search query and render result in a specific templates
     ``` HTML
      <search-results row-limit="3"  search-base-url="https://insightme.sharepoint.com" 
                            title="News Search" search-query="ContentType:NewsPage"
                            property-map='[{"from":"PATH","to":"link"},{"from":"PublishingImage","to":"image"},{"from":"Title","to":"title"},{"from":"Comments","to":"subtitle"}]'
                            select-properties='Title,PATH,Comments,PublishingImage'
                            web-url='https://insightme.sharepoint.com/sites/pub/news'/>
     ```
    * Sp Image : handles the retrieval of the image from SPOnline using the original image url returned in the search query
4. Redis Cache to store key,value for the retrieved Images
5. SharePoint online (content store)
 it's simply where your content exists.

## How to run the sample 
Simply clone and run 
```
 npm install 
```