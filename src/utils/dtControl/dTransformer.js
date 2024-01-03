
export function treeTransformerTwoValues(data, labelKey, valueKey) {
  if (!data) return [];

  const options = [];
  for (const node of data) {
    const label = node[labelKey];
    const value = node[valueKey];
    console.log(valueKey)
    // console.log(parentLabel)

    const option = { label, value };

    if (node.children) {
      const childOptions = treeTransformerTwoValues(node.children, labelKey, valueKey);
      option.children = childOptions;
    }

    options.push(option);
  }

  return options;
}


export function mapOnePropToObject(temp_list, prop) {
  if (!Array.isArray(temp_list)) {
    console.error('Error: transformData expects an array as the first argument');
    return;
  } else {
    return temp_list.map(item => ({
      label: item[prop],
      value: item[prop],
      children: item.children ? mapOnePropToObject(item.children, prop) : null,
    }));
  }
}

export function TreemapTwoPropsToObject(temp_list, prop1, prop2) {
  if (!Array.isArray(temp_list)) {
    console.error('Error: mapTwoPropsToObject expects an array as the first argument');
    return;
  } else {
    return temp_list.map(item => ({
      label: item[prop1],
      value: item[prop2],
      children: item.children ? mapTwoPropsToObject(item.children, prop1, prop2) : null,
    }));
  }
}


export function treeTransformerMultiyvalue(data, labelKey, valueKey, permsKey, permsLabelKey, permsValueKey) {
  if (!data) return [];

  const transformNode = (node) => {
    const label = node[labelKey];
    const value = node[valueKey];
    const transformedNode = { label, value };

    if (node.children) {
      transformedNode.children = node.children.map(transformNode);
    }

    if (node[permsKey]) {
      const transformPerm = (perm) => ({
        label: perm[permsLabelKey],
        value: perm[permsValueKey],
      });

      transformedNode.children = (transformedNode.children || []).concat(node[permsKey].map(transformPerm));
    }

    return transformedNode;
  };

  return data.map(transformNode);
}





export function NormalmapTwoPropsToObject(temp_list, prop1, prop2) {
  if (!Array.isArray(temp_list)) {
    console.error('Error: transformData expects an array as the first argument');
    return;
  } else {
    return temp_list.map(item => ({
      label: item[prop1],
      value: item[prop2]
    }));
  }
}

