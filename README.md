# Dataporten Livecounter App

The app is a simple page that gives the number of exercises solved in Kikora for the schools, counties and countries associated with the logged in user based on group information from Dataporten.

## API

Following is a description of the API that is publicly available. A `GET` call to https://kikora-test.dataporten-api.no/ (with a valid authorization header) gives a response similar to this.

```json
{
  "version": 1,
  "errors": [],
  "data": [
    {
      "organization": {
        "name": "Norway"
      },
      "solvedExercises": {
        "today": 97216,
        "lastMinute": 254
      }
    },
    {
      "organization": {
        "parent": "Norway",
        "name": "Oslo kommune"
      },
      "solvedExercises": {
        "today": 18312,
        "lastMinute": 103
      }
    }
  ]
}
```

There are three fields at the top level. `version` is changed whenever significant changes are made to this API, so that clients can check for the expected version. `errors` is a list of strings describing errors that occurred when processing the request. `data` is a list of objects with organization and exercise counter data.

In the `organization` object, a parent can be specified. A parent can have more than one children. In the `solvedExercises` object, the `today` and `lastMinute` fields are always present but may be set to the 0 if an error occurred when processing the request.
