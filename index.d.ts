declare type SubstitutionsMap = {
    [key: string]: string;
};
declare type Substitutions = string | number | SubstitutionsMap;

declare function template(templateString: string, substitutions: Substitutions): string;
declare namespace template {
    var regKey: RegExp;
}

declare function createComplexTemplate(variables: {
    [key: string]: string;
}): (template: string) => any;
declare namespace createComplexTemplate {
    var regKey: RegExp;
}

declare function getPluralIndex(number: number): 0 | 1 | 2;

export { template, createComplexTemplate, getPluralIndex };
