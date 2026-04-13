import { z } from "zod";
import { ColDef } from "ag-grid-community";

export interface SchemaRegistryEntry<T> {
  schema: z.ZodObject<any>;
  columns: ColDef<T, any>[];
  defaultData?: T[];
}

import { liberiaSchemaRegistry, type LiberiaSchemaKeys } from "./liberia";
import { malawiSchemaRegistry, type MalawiSchemaKeys } from "./malawi";
import { sierraLeoneSchemaRegistry } from "./sierra_leone";
import { ethiopiaSchemaRegistry } from "./ethiopia";
import { globalScaleSchemaRegistry } from "./global_scale";

export const countrySchemaRegistry = {
  ...liberiaSchemaRegistry,
  ...malawiSchemaRegistry,
  ...sierraLeoneSchemaRegistry,
  ...ethiopiaSchemaRegistry,
  ...globalScaleSchemaRegistry,
} as const;

export type CountrySchemaKeys = keyof typeof countrySchemaRegistry;
