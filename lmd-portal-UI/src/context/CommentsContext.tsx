// "use client";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   ReactNode,
// } from "react";

// interface CommentsContextProps {
//   isCommentsOpen: boolean;
//   toggleCommentsSection: () => void;
// }

// const CommentsContext = createContext<CommentsContextProps | undefined>(
//   undefined
// );

// export const useComments = (): CommentsContextProps => {
//   const context = useContext(CommentsContext);
//   if (!context) {
//     throw new Error("useComments must be used within a CommentsProvider");
//   }
//   return context;
// };

// interface CommentsProviderProps {
//   children: ReactNode;
// }

// export const CommentsProvider: React.FC<CommentsProviderProps> = ({
//   children,
// }) => {
//   const [isCommentsOpen, setIsCommentsOpen] = useState(false);

//   const toggleCommentsSection = useCallback(() => {
//     setIsCommentsOpen((prevState) => !prevState);
//   }, []);

//   return (
//     <CommentsContext.Provider value={{ isCommentsOpen, toggleCommentsSection }}>
//       {children}
//     </CommentsContext.Provider>
//   );
// };
