export interface NotionPostResult {
  results: [
    {
      properties: OriginPropsType;
      url: string;
    },
  ];
}

export interface OriginPropsType {
  date: {
    id: string;
    type: string;
    date: { start: string; end: string; time_zone: string };
  };
  tags: DefaultMultiSelectInfo;
  project: DefaultMultiSelectInfo;
  "sub-title": {
    id: string;
    type: string;
    rich_text: [{ plain_text: string }];
  };
  category: DefaultMultiSelectInfo;
  title: { id: string; type: string; title: [{ plain_text: string }] };
}

interface DefaultMultiSelectInfo {
  id: string;
  type: string;
  multi_select: CommonMultiSelect[];
}

export interface PostSimple {
  date: { start: string; end: string; time_zone: string };
  tags: CommonMultiSelect[];
  "sub-title": string;
  category: string;
  title: string;
  url: string;
}

export interface NotionPropertiesResult {
  properties: {
    tags: { multi_select: { options: CommonMultiSelect[] } };
    project: { multi_select: { options: CommonMultiSelect[] } };
    category: { multi_select: { options: CommonMultiSelect[] } };
  };
}

export interface NotionDatabaseProperty {
  tags: CommonMultiSelect[];
  project: CommonMultiSelect[];
  category: CommonMultiSelect[];
}

interface CommonMultiSelect {
  id: string;
  name: string;
}

const getValueByType = (result: any) => {
  const type = result?.type;

  switch (type) {
    case "date":
      return result.date;
    case "title":
      return result.title[0]?.plain_text;
    case "rich_text":
      return result.rich_text[0]?.plain_text;
    case "multi_select":
      return result.multi_select;
  }
};

export const notionPostResultParse = (
  postOrigin: OriginPropsType,
  url: string,
): PostSimple => {
  return {
    date: getValueByType(postOrigin.date),
    tags: getValueByType(postOrigin.tags),
    category: getValueByType(postOrigin.category),
    "sub-title": getValueByType(postOrigin["sub-title"]),
    title: getValueByType(postOrigin.title),
    url: url,
  };
};

export const notionPropsResultParse = (
  propsOrigin: NotionPropertiesResult,
): NotionDatabaseProperty => {
  const { tags, category, project } = propsOrigin.properties;

  return {
    tags: tags.multi_select.options,
    category: category.multi_select.options,
    project: project.multi_select.options,
  };
};