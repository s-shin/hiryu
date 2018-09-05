/// <reference types="react" />
import * as styledComponents from "styled-components";
import Theme from "./theme";
declare const styled: styledComponents.ThemedBaseStyledInterface<Theme>, css: styledComponents.ThemedCssFunction<Theme>, injectGlobal: (strings: TemplateStringsArray, ...interpolations: styledComponents.SimpleInterpolation[]) => void, keyframes: (strings: TemplateStringsArray, ...interpolations: styledComponents.SimpleInterpolation[]) => string, ThemeProvider: import("react").ComponentClass<styledComponents.ThemeProviderProps<Theme>, any>;
export { css, injectGlobal, keyframes, ThemeProvider };
export default styled;
