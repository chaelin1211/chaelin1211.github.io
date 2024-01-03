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

  addFilter(property: string, contain: string, type: string = "multi_select") {
    let filter: any = {
      property: property,
    };
    switch (type) {
      case "muti_select":
        filter[type] = {
          contains: contain,
        };
      case "select":
        filter[type] = {
          equals: contain,
        };
    }
    this.and.push(filter);
  }
}

export { NotionPostAndFilter };
