import {
  ILibCrossCutting1,
  libCrossCutting1_columns,
  libCrossCutting1_schema,
} from "./lib_cross_cutting_1";
import {
  libCrossCutting2_schema,
  libCrossCutting2_columns,
  ILibCrossCutting2,
} from "./lib_cross_cutting_2";
import {
  libStrengthen1_schema,
  libStrengthen1_columns,
  ILibStrengthen1,
} from "./lib_strengthen_1";

import libCrossCutting_1_data from "../../lib_cross_cutting_1.json";
import { SchemaRegistryEntry } from "..";
import {
  ILibStrengthen2,
  libStrengthen2_columns,
  libStrengthen2_schema,
} from "./lib_strengthen_2";
import {
  ILibStrengthen3,
  libStrengthen3_columns,
  libStrengthen3_schema,
} from "./lib_strengthen_3";
import {
  ILibStrengthen4,
  libStrengthen4_columns,
  libStrengthen4_schema,
} from "./lib_strengthen_4";
import {
  libStrengthen5_schema,
  libStrengthen5_columns,
  ILibStrengthen5,
} from "./lib_strengthen_5";
import {
  ILibStrengthen6,
  libStrengthen6_columns,
  libStrengthen6_schema,
} from "./lib_strengthen_6";
import {
  libStrengthen7_schema,
  libStrengthen7_columns,
  ILibStrengthen7,
} from "./lib_strengthen_7";
import {
  libUpskill1_2_schema,
  libUpskill1_2_columns,
  ILibUpskill1_2,
} from "./lib_upskill_1_2";
import {
  libDeliver123_schema,
  libDeliver123_columns,
  ILibDeliver123,
} from "./lib_deliver_1_2_3";
import {
  libDeliver4_schema,
  libDeliver4_columns,
  ILibDeliver4,
} from "./lib_deliver_4";
import {
  ILibDeliver5,
  libDeliver5_columns,
  libDeliver5_schema,
} from "./lib_deliver_5";

import {
  ILibDeliver6,
  libDeliver6_columns,
  libDeliver6_schema,
} from "./lib_deliver_6";

import {
  ILibVisNarratives,
  libVisNarratives_columns,
  libVisNarratives_schema,
} from "./lib_vis_narratives";

export const liberiaSchemaRegistry: {
  [key: string]: SchemaRegistryEntry<any>;
} = {
  lib_cross_cutting_1: {
    schema: libCrossCutting1_schema,
    columns: libCrossCutting1_columns,
    defaultData: libCrossCutting_1_data as unknown as ILibCrossCutting1[], // You can replace this with actual default data or leave as empty array
  } as SchemaRegistryEntry<ILibCrossCutting1>,

  lib_cross_cutting_2: {
    schema: libCrossCutting2_schema,
    columns: libCrossCutting2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibCrossCutting2>,

  lib_strengthen_1: {
    schema: libStrengthen1_schema,
    columns: libStrengthen1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen1>,

  lib_strengthen_2: {
    schema: libStrengthen2_schema,
    columns: libStrengthen2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen2>,

  lib_strengthen_3: {
    schema: libStrengthen3_schema,
    columns: libStrengthen3_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen3>,

  lib_strengthen_4: {
    schema: libStrengthen4_schema,
    columns: libStrengthen4_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen4>,

  lib_strengthen_5: {
    schema: libStrengthen5_schema,
    columns: libStrengthen5_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen5>,

  lib_strengthen_6: {
    schema: libStrengthen6_schema,
    columns: libStrengthen6_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen6>,

  lib_strengthen_7: {
    schema: libStrengthen7_schema,
    columns: libStrengthen7_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibStrengthen7>,

  lib_upskill_1_2: {
    schema: libUpskill1_2_schema,
    columns: libUpskill1_2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibUpskill1_2>,

  lib_deliver_1_2_3: {
    schema: libDeliver123_schema,
    columns: libDeliver123_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibDeliver123>,

  lib_deliver_4: {
    schema: libDeliver4_schema,
    columns: libDeliver4_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibDeliver4>,

  lib_deliver_5: {
    schema: libDeliver5_schema,
    columns: libDeliver5_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibDeliver5>,

  lib_deliver_6: {
    schema: libDeliver6_schema,
    columns: libDeliver6_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibDeliver6>,

  lib_vis_narratives: {
    schema: libVisNarratives_schema,
    columns: libVisNarratives_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ILibVisNarratives>,
};

export type LiberiaSchemaKeys = keyof typeof liberiaSchemaRegistry;
