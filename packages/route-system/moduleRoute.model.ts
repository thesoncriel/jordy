/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react';

export interface ModuleRouteChildModel {
  path?: string;
  element?: ComponentType<any>;
  index?: boolean;
  children?: ModuleRouteChildModel[];
}

export interface ModuleRouteModel extends ModuleRouteChildModel {
  wrap?: ComponentType<any>;
}
