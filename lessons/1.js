GET /login?username=username&password=password 

Example response: {'apiToken': 12345}

---------------------------

GET /photos?apiToken=apiToken

Example response: ['photoId1', 'photoId2', ...]

---------------------------

GET /photos/export?apiToken=apiTokenphoto=photoId1&photo=photoId2

Example response: {'link': https://...}
