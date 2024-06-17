import React from 'react'; 
import { PanelMenu } from 'primereact/panelmenu';
import { InputText } from "primereact/inputtext";

import { vegetablesData } from '../common/data/vegetablesData';

const Vegetables = () => {

  const itemRenderer = (item) => (
    <div className="flex align-items-center px-3 py-2">
        <span className={`mx-2 ${item.items && 'font-semibold'}`}>{item.label}</span>
        <InputText keyfilter="int" type="number" placeholder={item.shortcut} className="ml-auto w-10 border-1 surface-border border-round surface-10 text-xs p-1" />


    </div>
  )

  const items = [
    {
      label: 'Овощи',
      items: vegetablesData.map(vegetable => ({
        label: vegetable.name,
        shortcut: vegetable.count.toString(),
        template: itemRenderer
      }))
    },
  ];

  return (
    <div className="card flex w-full justify-center">
      <PanelMenu model={items} className="w-[95%] md:w-20rem" />
    </div>
  )
}

export default Vegetables