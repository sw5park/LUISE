import openai
from typing import Dict, List
from task_manager import TaskManager
import pinecone
from collections import deque

class Agent:
    def __init__(self, config: Dict):
        """
        Initialize an agent instance with its configuration.

        :param config: A dictionary containing agent configuration.
        """
        self.config = config

    def __call__(self, **kwargs) -> str:
        """
        Call the agent with the provided keyword arguments.

        :param kwargs: Keyword arguments to be used in the agent's prompt.
        :return: The response text returned by the agent.
        """
        prompt = self.config["prompt"].format(**kwargs)
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=1000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return response.choices[0].text.strip()


class AIAssistant:
    def __init__(self, config: Dict) -> None:
        """
        Initialize the AI Assistant with its configuration and an instance of TaskManager.

        :param config: A dictionary containing the AI Assistant configuration.
        :param task_manager: An instance of the TaskManager class.
        """
        self.config = config
        self.table_name = self.config['pinecone']['pinecone_index']['table_name']

        self.task_manager = TaskManager()
        self.agents = {name: Agent(agent_config) for name, agent_config in config["agents"].items()}

    def get_ada_embedding(self, text: str) -> List[float]:
        """
        Generate an ADA text embedding.

        :param text: Input text for embedding.
        :return: List of floats as ADA text embedding.
        """
        text = text.replace("\n", " ")
        return openai.Embedding.create(input=[text], model="text-embedding-ada-002")["data"][0]["embedding"]

    def task_creation_agent(self, objective: str, result: Dict, task_description: str, task_list: List[str]) -> List[Dict]:
        """
        Call the task_creation agent.

        :param objective: The objective for the task_creation agent.
        :param result: A dictionary containing the result of the last completed task.
        :param task_description: The task description for the last completed task.
        :param task_list: A list of incomplete tasks.
        :return: A list of new tasks generated by the agent.
        """
        response_text = self.agents["task_creation"](objective=objective, result=result, task_description=task_description, task_list=', '.join(task_list))
        new_tasks = response_text.split('\n')
        return [{"task_name": task_name} for task_name in new_tasks]

    def prioritization_agent(self, this_task_id: int, objective: str) -> None:
        """
        Call the prioritization agent.

        :param this_task_id: The current task ID.
        :param objective: The objective for the prioritization agent.
        :return: None
        """
        task_names = [t["task_name"] for t in self.task_manager.task_list]
        next_task_id = int(this_task_id) + 1
        response_text = self.agents["prioritization"](task_names=task_names, objective=objective, next_task_id=next_task_id)
        new_tasks = response_text.split('\n')
        self.task_manager.task_list = deque()
        for task_string in new_tasks:
            task_parts = task_string.strip().split(".", 1)
            if len(task_parts) == 2:
                task_id = task_parts[0].strip()
                task_name = task_parts[1].strip()
                self.task_manager.add_task({"task_id": task_id, "task_name": task_name})


    def context_agent(self, query: str, index: str, n: int):

        """
        Retrieve relevant tasks using Pinecone.

        :param query: Input query for context tasks.
        :param index: Pinecone index name.
        :param n: Number of top tasks to retrieve.
        :return: List of relevant tasks.
        """
        
        query_embedding = self.get_ada_embedding(query)
        index = pinecone.Index(index_name=index)
        results = index.query(query_embedding, top_k=n, include_metadata=True)
        sorted_results = sorted(results.matches, key=lambda x: x.score, reverse=True)
        return [(str(item.metadata['task'])) for item in sorted_results]


    def execution_agent(self, objective: str, task: str) -> str:
        """
        Executes a task based on the given objective and task description.
                    
        :param objective: The overall objective for the AI system.
        :param task: A specific task to be executed by the AI system.
        :return: A string representing the result of the task execution by the AI agent.
        """
        context = self.context_agent(index='test-table', query=objective, n=5)
        response_text = self.agents["execution"](objective=objective, task=task, context=context)
        return response_text      

    def __str__(self) -> str:
        """
        Return a string representation of the AI Assistant state, including the task list.

        :return: A formatted string representing the AI Assistant state and task list.
        """
        task_list_str = str(self.task_manager)
        agent_list_str = ', '.join(self.agents.keys())
        return f"AI Assistant\nAgents: {agent_list_str}\nTask List:\n{task_list_str}"