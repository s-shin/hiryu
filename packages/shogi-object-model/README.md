# @hiryu/shogi-object-format

## Synopsis

```ts
import { schema, Record } from "@hiryu/shogi-object-format";

const recordData = { /* ... */ };

anyJsonSchemaValidator.validate({
  schema: som.schema,
  key: `${schema.$id}/definitions/Record`,
  data: recordData,
});

const record = recordData as Record;
```

## Build

```sh
./script/gen-schema-json.sh
yarn build
```
