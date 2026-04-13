import { SchemaRegistryEntry } from "..";
import {
  IGsCrossCutting3,
  gsCrossCutting3_columns,
  gsCrossCutting3_schema,
} from "./gs_cross_cutting_3";

import {
  IGsCrossCutting4,
  gsCrossCutting4_columns,
  gsCrossCutting4_schema,
} from "./gs_cross_cutting_4";
import {
  gsVisNarratives_columns,
  gsVisNarratives_schema,
  IGsVisNarratives,
} from "./gs_vis_narratives";

export const globalScaleSchemaRegistry: {
  [key: string]: SchemaRegistryEntry<any>;
} = {
  gs_cross_cutting_3: {
    schema: gsCrossCutting3_schema,
    columns: gsCrossCutting3_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IGsCrossCutting3>,

  gs_cross_cutting_4: {
    schema: gsCrossCutting4_schema,
    columns: gsCrossCutting4_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IGsCrossCutting4>,

  gs_vis_narratives: {
    schema: gsVisNarratives_schema,
    columns: gsVisNarratives_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IGsVisNarratives>,
};
