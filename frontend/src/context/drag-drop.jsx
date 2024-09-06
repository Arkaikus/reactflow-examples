import { createContext, useContext, useState } from 'react';

const DragDropContext = createContext([null, (_) => { }]);

export default DragDropContext;

export const useDragDrop = () => {
  return useContext(DragDropContext);
}