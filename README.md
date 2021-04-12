# go-restful-with-node-js

Demonstrative repo. Shows how to create a NodeJS/Express REST API. Data are stored in MongoDB and cached with REDIS.

## Installation

You need to have Docker Installed.

Run the app typing:

```
docker-compose up -d
```

## Usage

You can play with these COVID variants describing objects:

```
[
    {
      "variant_id": "B.1.351",
      "name": "Southafrican variant updated"
    },
    {
      "variant_id": "P.1",
      "name": "Southafrican variant patched"
    },
    {
      "variant_id": "B.1.1.7",
      "name": "UK variant"
    }
  ]
```

I recommend using POSTMAN to easily perform the API calls you decide to do to test the APP

You can GET the list of stored COVID-19 variants calling to:

```
http://localhost:2000/variants
```

Also GET a single variant calling to:

```
http://localhost:2000/variants/[variant_id]
```

And also POST, PUT, PATCH & DELETE variants at:

```
http://localhost:2000/variants/[variant_id]
```

API responses include a "redis_report" element to show the operation performed by REDIS.
When you GET the list of variants for first time the Mongo response is stored in Redis.
Next calls to the same endpoint will retrieved data from Redis not from Mongo, unless a POST/PUT/PATCH/DELETE operation has been performed in between.
Such operations produce changes in the variants lists. That's why the APP deletes the cache to ensure consistency in the next API call, which will retrieve data from Mongo again.
