import { SchemaRegistryEntry } from "..";
import {
  ethCrossCutting1_schema,
  ethCrossCutting1_columns,
  IEthCrossCutting1,
} from "./eth_cross_cutting_1";
import {
  ethCrossCutting2_schema,
  ethCrossCutting2_columns,
  IEthCrossCutting2,
} from "./eth_cross_cutting_2";
import {
  ethDeliver1_columns,
  ethDeliver1_schema,
  IEthDeliver1,
} from "./eth_deliver_1";
import {
  ethDeliver2_columns,
  ethDeliver2_schema,
  IEthDeliver2,
} from "./eth_deliver_2";
import {
  ethStrengthen1_columns,
  ethStrengthen1_schema,
  IEthStrengthen1,
} from "./eth_strengthen_1";
import {
  ethUpskill1_schema,
  ethUpskill1_columns,
  IEthUpskill1,
} from "./eth_upskill_1";
import {
  ethUpskill2_schema,
  ethUpskill2_columns,
  IEthUpskill2,
} from "./eth_upskill_2";
import {
  ethUpskill3_4_schema,
  ethUpskill3_4_columns,
  IEthUpskill3_4,
} from "./eth_upskill_3_4";
import {
  ethVisNarratives_columns,
  ethVisNarratives_schema,
  IEthVisNarratives,
} from "./eth_vis_narratives";

export const ethiopiaSchemaRegistry: {
  [key: string]: SchemaRegistryEntry<any>;
} = {
  eth_cross_cutting_1: {
    schema: ethCrossCutting1_schema,
    columns: ethCrossCutting1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthCrossCutting1>,

  eth_cross_cutting_2: {
    schema: ethCrossCutting2_schema,
    columns: ethCrossCutting2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthCrossCutting2>,

  eth_strengthen_1: {
    schema: ethStrengthen1_schema,
    columns: ethStrengthen1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthStrengthen1>,

  eth_upskill_1: {
    schema: ethUpskill1_schema,
    columns: ethUpskill1_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthUpskill1>,

  eth_upskill_2: {
    schema: ethUpskill2_schema,
    columns: ethUpskill2_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthUpskill2>,

  eth_upskill_3_4: {
    schema: ethUpskill3_4_schema,
    columns: ethUpskill3_4_columns,
    defaultData: [],
  } as SchemaRegistryEntry<IEthUpskill3_4>,

  eth_vis_narratives: {
    schema: ethVisNarratives_schema,
    columns: ethVisNarratives_columns,
  } as SchemaRegistryEntry<IEthVisNarratives>,

  eth_deliver_1: {
    schema: ethDeliver1_schema,
    columns: ethDeliver1_columns,
  } as SchemaRegistryEntry<IEthDeliver1>,

  eth_deliver_2: {
    schema: ethDeliver2_schema,
    columns: ethDeliver2_columns,
  } as SchemaRegistryEntry<IEthDeliver2>,
};

export type EthiopiaSchemaKeys = keyof typeof ethiopiaSchemaRegistry;
