import { SchemaRegistryEntry } from "..";
import {
  slCrossCutting1_schema,
  slCrossCutting1_columns,
  ISlCrossCutting1,
} from "./sl_cross_cutting_1";
import {
  slCrossCutting2_schema,
  slCrossCutting2_columns,
  ISlCrossCutting2,
} from "./sl_cross_cutting_2";
import {
  slStrengthen1_schema,
  slStrengthen1_columns,
  ISlStrengthen1,
} from "./sl_strengthen_1";
import {
  slStrengthen2_schema,
  slStrengthen2_columns,
  ISlStrengthen2,
} from "./sl_strengthen_2";
import {
  slStrengthen3_schema,
  slStrengthen3_columns,
  ISlStrengthen3,
} from "./sl_strengthen_3";
import {
  slUpskill1_schema,
  slUpskill1_columns,
  ISlUpskill1,
} from "./sl_upskill_1";
import {
  ISlUpskill123,
  slUpskill123_columns,
  slUpskill123_schema,
} from "./sl_upskill_1_2_3";
import {
  ISlVisNarratives,
  slVisNarratives_columns,
  slVisNarratives_schema,
} from "./sl_vis_narratives";

export const sierraLeoneSchemaRegistry: {
  [key: string]: SchemaRegistryEntry<any>;
} = {
  sl_cross_cutting_1: {
    schema: slCrossCutting1_schema,
    columns: slCrossCutting1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlCrossCutting1>,

  sl_cross_cutting_2: {
    schema: slCrossCutting2_schema,
    columns: slCrossCutting2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlCrossCutting2>,

  sl_strengthen_1: {
    schema: slStrengthen1_schema,
    columns: slStrengthen1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlStrengthen1>,

  sl_strengthen_2: {
    schema: slStrengthen2_schema,
    columns: slStrengthen2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlStrengthen2>,

  sl_strengthen_3: {
    schema: slStrengthen3_schema,
    columns: slStrengthen3_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlStrengthen3>,

  sl_upskill_1: {
    schema: slUpskill1_schema,
    columns: slUpskill1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlUpskill1>,

  sl_upskill_1_2_3: {
    schema: slUpskill123_schema,
    columns: slUpskill123_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlUpskill123>,

  sl_vis_narratives: {
    schema: slVisNarratives_schema,
    columns: slVisNarratives_columns,
    defaultData: [],
  } as SchemaRegistryEntry<ISlVisNarratives>,
};

export type SierraLeoneSchemaKeys = keyof typeof sierraLeoneSchemaRegistry;
