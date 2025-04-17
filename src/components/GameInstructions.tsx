
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

const GameInstructions: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
          <DialogDescription>
            Learn Spanish through reading comprehension challenges
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-semibold">Game Rules:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Read the Spanish passage carefully.</li>
              <li>Click on any word to see its English translation.</li>
              <li>You can only look up 10 words per passage.</li>
              <li>Answer the comprehension question correctly to advance.</li>
              <li>If you run out of lookups, you must still answer the question to continue.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tips:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Look up key words that seem important to the story.</li>
              <li>Try to understand the context before using all your lookups.</li>
              <li>Words you've already looked up will be highlighted in red.</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">Start Learning</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;
