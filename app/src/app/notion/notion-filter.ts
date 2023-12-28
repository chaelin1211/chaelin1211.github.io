interface MultiSelectFilter {
  property: string;
  multi_select: {
    contains: string;
  };
}

class NotionPostAndFilter {
  and: MultiSelectFilter[];

  constructor() {
    this.and = [];
  }

  addFilter(property: string, contains: string) {
    this.and.push({
      property: property,
      multi_select: {
        contains: contains,
      },
    });
  }
}

export { NotionPostAndFilter };