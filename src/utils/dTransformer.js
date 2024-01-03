export function treeTransformerTwoValues(data, parentLabel) {
    if (!data) return [];

    const options = [];
    for (const node of data) {
      const label = node.name || parentLabel;
      const value = node.deptId;
  
      const option = { label, value };
  
      if (node.children) {
        const childOptions = treeTransformerTwoValues(node.children, label);
        option.children = childOptions;
      }
  
      options.push(option);
    }
  
    return options;
  }

  // export function mapOnePropToObject(temp_list) {
  //   if (!Array.isArray(temp_list)) {
  //     console.error('Error: transformData expects an array as the first argument');
  //     return;
  //   } else {
  //     return temp_list.map(item => ({
  //       label: item.name,
  //       value: item.deptId,
  //       children: item.children ? mapOnePropToObject(item.children) : null,
  //     }));
  //   }
  // }
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