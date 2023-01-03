Current User Membership 

A fragment that shows current user's site memberships, and optionally, configurable to show or hide roles and membership in user groups and/or accounts and/or organizations.

The fragment uses a GraphQL call instead of the ReST API with the following advantages of GraphQL

1. The structure of the resulting JSON data is specified by the query, so it is predictable.
2. The amount of data from the server is reduced since we're only getting the queried fields in return.
3. Reduces multiple API calls to a single GraphQL query.  In this use case, the reduction is only from 2 API calls to 1, but in other scenarios, the number of calls to the server can be dramatically reduced resulting in significant performance gains.

The query payload is 
{
  myUserAccount {
    id
    emailAddress
    image
    jobTitle
    accountBriefs {
      id
            name
    }
    roleBriefs {
      id
      name
    }
    userGroupBriefs {
      id
      name
    }
    organizationBriefs {
      id
      name
    }
  }
    
  myUserAccountSites {
    items {
      id
      name
      friendlyUrlPath
    }
  }  
}
