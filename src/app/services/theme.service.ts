import { Injectable } from '@angular/core';
import { Solver, Color } from '../utils/color-filter';
import { themeProperties } from '../config/theme.config';
import { themeDefaults } from '../config/theme.defaults';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  public generateIconFilter(color: string): string {
    const solver = new Solver(color);
    const result = solver.solve();
    return result.filter;
  }

  public setIconFilter(color: string): void {
    const filter = this.generateIconFilter(color);
    document.documentElement.style.setProperty('--icon-filter', filter);
  }

  public setThemeProperty(variable: string, value: string): void {
    document.documentElement.style.setProperty(variable, value);
    localStorage.setItem(variable, value);

    if (variable === '--icon-color') {
      this.setIconFilter(value);
    }
  }

  public updateDerivedColors(): void {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
    if (bgColor) {
        const color = new Solver(bgColor).target;
        const surfaceColor = color.darken(0.08).toHex();
        this.setThemeProperty('--surface-color', surfaceColor);

        const editorTextColor = color.isLight() ? '#000000' : '#ffffff';
        this.setThemeProperty('--editor-text-color', editorTextColor);
    }
  }

  public loadTheme(): void {
    themeProperties.forEach(prop => {
      let value = localStorage.getItem(prop.variable);
      if (!value) {
        value = themeDefaults[prop.variable];
      }
      if (value) {
        this.setThemeProperty(prop.variable, value);
      }
    });
    this.updateDerivedColors();
  }
}
