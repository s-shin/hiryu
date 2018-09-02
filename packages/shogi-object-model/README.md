# @hiryu/shogi-object-model

## Synopsis

```ts
import * as som from "@hiryu/shogi-object-model";

const recordData = { /* ... */ };

anyJsonSchemaValidator.validate({
  schema: som.schema,
  key: `${som.schema.$id}/definitions/Record`,
  data: recordData,
});

const record = recordData as Record;
```

## Build

```sh
./script/gen-schema-json.sh
yarn build
```
