import { Flex, Small, H3, Grid, Pagination } from '@bigcommerce/big-design';
import React, { type SetStateAction, useState } from 'react';
import { StyledFlex, StyledAiResults } from './styled';
import { useAppContext } from '~/context/AppContext';
import { useTracking } from '~/hooks/useTracking';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import Loader from '../Loader';

const ReactQuill = dynamic(() => import('react-quill'), {
  loading: () => <Loader />,
});

export interface Result {
  description: string;
  promptAttributes: string;
}

interface AiResultsProps {
  results: Result[];
  onChange(index: number, description: string): void;
}

export default function AiResults({ results, onChange }: AiResultsProps) {
  const [page, setPage] = useState(results.length);

  const { locale, storeHash, context } = useAppContext();
  const { trackClick } = useTracking();

  const currentResult = results.at(page - 1);

  const handlePageChange = (newPageVal: SetStateAction<number>) => {
    const newPage = Number(newPageVal);
    setPage(newPage);
    onChange(newPage - 1, results.at(newPage - 1)?.description || '');

    trackClick({
      context,
      locale,
      storeHash,
      action: newPage > page ? 'Next result' : 'Previous result',
    });
  };

  const handleValueChange = (editorState: string) =>
    onChange(page - 1, editorState);

  return (
    <Flex marginTop="large" flexDirection="column">
      <Grid marginBottom="medium" gridColumnGap="0">
        <StyledAiResults
          alignItems="flex-end"
          justifyContent="space-between"
          flexDirection="row"
        >
          <Flex flexDirection="column" alignItems="flex-start">
            <H3 marginBottom="none">Results</H3>
            <Small>Please review and proofread before publishing.</Small>
          </Flex>
          <Pagination
            currentPage={page}
            itemsPerPage={1}
            itemsPerPageOptions={[page]}
            onItemsPerPageChange={() => null}
            onPageChange={handlePageChange}
            totalItems={results.length}
          />
        </StyledAiResults>
      </Grid>
      <StyledFlex>
        <ReactQuill
          value={currentResult?.description}
          onChange={handleValueChange}
        />
      </StyledFlex>
      <Small marginTop="medium">{currentResult?.promptAttributes}</Small>
    </Flex>
  );
}
