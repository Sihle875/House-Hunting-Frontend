// src/app/pipes/property-count.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { Property } from '../services/property.service';

@Pipe({ name: 'availableCount', standalone: true })
export class AvailableCountPipe implements PipeTransform {
  transform(properties: Property[]): number {
    return properties.filter(p => p.available).length;
  }
}

@Pipe({ name: 'unavailableCount', standalone: true })
export class UnavailableCountPipe implements PipeTransform {
  transform(properties: Property[]): number {
    return properties.filter(p => !p.available).length;
  }
}
