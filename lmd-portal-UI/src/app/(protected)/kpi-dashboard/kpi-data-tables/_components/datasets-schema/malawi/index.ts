import { SchemaRegistryEntry } from "..";
import {
  mlwCrossCutting1_schema,
  mlwCrossCutting1_columns,
  IMlwCrossCutting1,
} from "./mlw_cross_cutting_1";
import {
  IMlwCrossCutting2,
  mlwCrossCutting2_columns,
  mlwCrossCutting2_schema,
} from "./mlw_cross_cutting_2";
import {
  IMlwDeliver1,
  mlwDeliver1_columns,
  mlwDeliver1_schema,
} from "./mlw_deliver_1";
import {
  mlwStrengthen1_schema,
  IMlwStrengthen1,
  mlwStrengthen1_columns,
} from "./mlw_strengthen_1";
import {
  mlwStrengthen2_schema,
  IMlwStrengthen2,
  mlwStrengthen2_columns,
} from "./mlw_strengthen_2";
import {
  IMlwStrengthen3,
  mlwStrengthen3_columns,
  mlwStrengthen3_schema,
} from "./mlw_strengthen_3";
import {
  IMlwStrengthen4,
  mlwStrengthen4_columns,
  mlwStrengthen4_schema,
} from "./mlw_strengthen_4";
import {
  mlwStrengthen5_schema,
  mlwStrengthen5_columns,
  IMlwStrengthen5,
} from "./mlw_strengthen_5";
import {
  mlwStrengthen6_schema,
  mlwStrengthen6_columns,
  IMlwStrengthen6,
} from "./mlw_strengthen_6";
import {
  IMlwUpskill123,
  mlwUpskill123_columns,
  mlwUpskill123_schema,
} from "./mlw_upskill_1_2_3";
import {
  IMlwVisNarratives,
  mlwVisNarratives_columns,
  mlwVisNarratives_schema,
} from "./mlw_vis_narratives";

export const malawiSchemaRegistry: { [key: string]: SchemaRegistryEntry<any> } =
  {
    mlw_cross_cutting_1: {
      schema: mlwCrossCutting1_schema,
      columns: mlwCrossCutting1_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwCrossCutting1>,

    mlw_cross_cutting_2: {
      schema: mlwCrossCutting2_schema,
      columns: mlwCrossCutting2_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwCrossCutting2>,

    mlw_strengthen_1: {
      schema: mlwStrengthen1_schema,
      columns: mlwStrengthen1_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen1>,

    mlw_strengthen_2: {
      schema: mlwStrengthen2_schema,
      columns: mlwStrengthen2_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen2>,

    mlw_strengthen_3: {
      schema: mlwStrengthen3_schema,
      columns: mlwStrengthen3_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen3>,

    mlw_strengthen_4: {
      schema: mlwStrengthen4_schema,
      columns: mlwStrengthen4_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen4>,

    mlw_strengthen_5: {
      schema: mlwStrengthen5_schema,
      columns: mlwStrengthen5_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen5>,

    mlw_strengthen_6: {
      schema: mlwStrengthen6_schema,
      columns: mlwStrengthen6_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwStrengthen6>,

    mlw_upskill_1_2_3: {
      schema: mlwUpskill123_schema,
      columns: mlwUpskill123_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwUpskill123>,

    mlw_deliver_1: {
      schema: mlwDeliver1_schema,
      columns: mlwDeliver1_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwDeliver1>,

    mlw_vis_narratives: {
      schema: mlwVisNarratives_schema,
      columns: mlwVisNarratives_columns,
      defaultData: [],
    } as SchemaRegistryEntry<IMlwVisNarratives>,
  };

export type MalawiSchemaKeys = keyof typeof malawiSchemaRegistry;
