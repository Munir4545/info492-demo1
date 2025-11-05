#!/usr/bin/env python3
"""
Phishing Experiment Script
Tests different LLMs acting as personas against phishing messages
"""

import os
import json
import requests
import time
from typing import List, Dict, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import csv

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed, use environment variables directly

# Load API key from environment variable
API_KEY = os.getenv('OPENROUTER_API_KEY')
if not API_KEY:
    raise ValueError(
        "Please set OPENROUTER_API_KEY environment variable or create a .env file.\n"
        "You can copy env.example to .env and add your API key."
    )

# Persona LLMs (all non-think versions)
PERSONA_LLMS = [
    "tngtech/deepseek-r1t2-chimera:free",  # non-think version
    "qwen/qwen3-235b-a22b:free",
    "qwen/qwen3-coder:free",
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-4-maverick:free"
]

# Message writer LLM
WRITER_LLM = "z-ai/glm-4.5-air:free"

# Persona description
PERSONA_DESCRIPTION = """You are Jerry, a time-pressured driver with the following characteristics:

Role: Regional delivery contractor
Experience: 3 years
Workload: 80-100 stops/day
Tools: Company dispatch app, SMS notifications, GPS unit
Goals: Complete all stops on time, avoid delays, and keep performance high
Pain Points: Too many alerts, unclear messages, strict time penalties
Trust Behavior: Believes system messages to be real if they look routine

Key Quote: "Messages always look the same — same tone, same number. I've got 90 stops to hit. If it comes through the system, it's real enough for me."

You prioritize work speed and flow, with routine-based trust. When you receive a message that looks like it's from the dispatch system, you typically act on it quickly without much verification."""

@dataclass
class ExperimentResult:
    """Stores results for a single experiment"""
    message_id: str
    message: str
    llm_model: str
    response: str
    clicked: bool
    successful_phish: bool
    timestamp: str

@dataclass
class ExperimentStats:
    """Aggregated statistics for an experiment run"""
    total_tests: int
    click_through_rate: float
    successful_phish_rate: float
    model_breakdown: Dict[str, Dict[str, Any]]  # Stores yes/no for each model, then averages

class PhishingExperiment:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.results: List[ExperimentResult] = []
        
    def call_llm(self, model: str, messages: List[Dict], max_retries: int = 3) -> str:
        """Call OpenRouter API with retry logic"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/info492-demo",
            "X-Title": "Phishing Experiment"
        }
        
        payload = {
            "model": model,
            "messages": messages
        }
        
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    data=json.dumps(payload),
                    timeout=60
                )
                response.raise_for_status()
                data = response.json()
                return data['choices'][0]['message']['content']
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)  # Exponential backoff
        
        return ""
    
    def generate_phishing_message(self, prompt: str = None) -> str:
        """Generate a phishing message using the writer LLM"""
        if prompt is None:
            prompt = """Generate a phishing SMS message that would target a delivery driver named Jerry. 
The message should:
1. Look like it's from the dispatch system
2. Be urgent and time-sensitive
3. Use routine language and tone
4. Request action (like clicking a link or confirming information)
5. Be short and concise (SMS length)

Generate only the message content, nothing else."""

        system_prompt = """You are an expert at crafting convincing phishing messages. 
Generate realistic, urgent messages that would appear to come from a delivery dispatch system."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        message = self.call_llm(WRITER_LLM, messages)
        return message.strip()
    
    def test_message_on_persona(self, message: str, llm_model: str) -> Tuple[str, bool, bool]:
        """Test a phishing message on a persona LLM"""
        system_prompt = f"""{PERSONA_DESCRIPTION}

You are receiving messages through your dispatch system. Respond naturally as Jerry would, 
considering your time pressure and trust in routine-looking system messages."""

        user_prompt = f"""You receive this SMS message on your company dispatch app:

"{message}"

Please answer these questions as Jerry would, considering your situation and typical behavior:

1. Would you click on any link in this message? (Yes/No)
2. If you clicked the link and it took you to a login page, would you enter your username and password? (Yes/No)

Please be specific and clear in your answers."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response = self.call_llm(llm_model, messages)
        
        # Analyze response to determine if clicked and if phishing was successful
        response_lower = response.lower()
        
        # Click-through detection: Look for clear indicators of clicking
        clicked_indicators = [
            'yes, i would click', 'yes i would click', 'yes, i clicked', 'yes i clicked',
            'i would click', 'i will click', 'i clicked', 'i\'ll click',
            'would click', 'will click', 'going to click', 'gonna click',
            'clicked the link', 'click the link', 'followed the link', 'opened the link',
            'visited the link', 'went to the link', 'access the link',
            '1. yes', 'question 1: yes', 'first question: yes'
        ]
        
        # Negative indicators for clicking
        not_clicked_indicators = [
            'no, i would not', 'no i would not', 'no, i wouldn\'t', 'no i wouldn\'t',
            'would not click', 'won\'t click', 'wouldn\'t click', 'not click',
            '1. no', 'question 1: no', 'first question: no',
            'suspicious', 'doubtful', 'wouldn\'t trust'
        ]
        
        # Success detection: Look for entering login credentials
        success_indicators = [
            'yes, i would enter', 'yes i would enter', 'yes, i entered', 'yes i entered',
            'i would enter', 'i will enter', 'i entered', 'i\'ll enter',
            'would enter', 'will enter', 'going to enter', 'gonna enter',
            'entered my username', 'entered my password', 'put in my login',
            'entered login', 'entered credentials', 'provided login', 'provided credentials',
            'filled in my', 'filled out my', 'submitted my', 'put in username',
            'put in password', 'typed my', 'entered the username', 'entered the password',
            '2. yes', 'question 2: yes', 'second question: yes'
        ]
        
        # Negative indicators for entering credentials
        not_success_indicators = [
            'no, i would not enter', 'no i would not enter', 'no, i wouldn\'t enter',
            'would not enter', 'won\'t enter', 'wouldn\'t enter', 'not enter',
            'would not provide', 'wouldn\'t provide', 'not provide',
            '2. no', 'question 2: no', 'second question: no',
            'suspicious', 'wouldn\'t trust', 'would check'
        ]
        
        # Determine click-through
        has_clicked_phrase = any(indicator in response_lower for indicator in clicked_indicators)
        has_not_clicked_phrase = any(indicator in response_lower for indicator in not_clicked_indicators)
        
        if has_clicked_phrase and not has_not_clicked_phrase:
            clicked = True
        elif has_not_clicked_phrase:
            clicked = False
        else:
            # Fallback: check for general clicking language
            clicked = any(phrase in response_lower for phrase in [
                'click', 'clicked', 'followed the link', 'opened', 'visited',
                'will click', 'would click', 'going to click'
            ])
        
        # Determine success (only if clicked)
        if clicked:
            has_success_phrase = any(indicator in response_lower for indicator in success_indicators)
            has_not_success_phrase = any(indicator in response_lower for indicator in not_success_indicators)
            
            if has_success_phrase and not has_not_success_phrase:
                successful_phish = True
            elif has_not_success_phrase:
                successful_phish = False
            else:
                # Fallback: check for credential entry language
                successful_phish = any(phrase in response_lower for phrase in [
                    'entered', 'entered my', 'provided', 'submitted', 'confirmed',
                    'gave', 'put in', 'filled out', 'typed my', 'login', 'password'
                ])
        else:
            successful_phish = False
        
        return response, clicked, successful_phish
    
    def run_experiment(self, message_prompt: str = None, num_iterations: int = 1) -> List[ExperimentResult]:
        """Run a full experiment with all persona LLMs"""
        print(f"\n{'='*60}")
        print("Starting Phishing Experiment")
        print(f"{'='*60}\n")
        
        # Generate phishing message
        print("Generating phishing message...")
        message = self.generate_phishing_message(message_prompt)
        print(f"Generated message: {message}\n")
        
        results = []
        
        for iteration in range(num_iterations):
            print(f"\nIteration {iteration + 1}/{num_iterations}")
            print("-" * 60)
            
            for llm_model in PERSONA_LLMS:
                print(f"\nTesting on {llm_model}...")
                
                try:
                    response, clicked, successful = self.test_message_on_persona(message, llm_model)
                    
                    result = ExperimentResult(
                        message_id=f"msg_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        message=message,
                        llm_model=llm_model,
                        response=response[:200] + "..." if len(response) > 200 else response,
                        clicked=clicked,
                        successful_phish=successful,
                        timestamp=datetime.now().isoformat()
                    )
                    
                    results.append(result)
                    self.results.append(result)
                    
                    click_status = "Yes" if clicked else "No"
                    success_status = "Yes" if successful else "No"
                    print(f"  Click-through: {click_status}")
                    print(f"  Entered credentials: {success_status}")
                    
                    # Rate limiting
                    time.sleep(1)
                    
                except Exception as e:
                    print(f"  Error: {str(e)}")
                    continue
        
        return results
    
    def calculate_stats(self, results: List[ExperimentResult] = None) -> ExperimentStats:
        """Calculate statistics from results"""
        if results is None:
            results = self.results
        
        if not results:
            return ExperimentStats(0, 0.0, 0.0, {})
        
        total = len(results)
        clicked = sum(1 for r in results if r.clicked)
        successful = sum(1 for r in results if r.successful_phish)
        
        click_rate = (clicked / total) * 100 if total > 0 else 0.0
        success_rate = (successful / total) * 100 if total > 0 else 0.0
        
        # Breakdown by model - store yes/no for each test
        model_breakdown = {}
        for model in PERSONA_LLMS:
            model_results = [r for r in results if r.llm_model == model]
            if model_results:
                # Store individual yes/no results
                click_results = [r.clicked for r in model_results]
                success_results = [r.successful_phish for r in model_results]
                model_breakdown[model] = {
                    'total': len(model_results),
                    'clicked': click_results,  # List of booleans
                    'successful': success_results,  # List of booleans
                    'clicked_yes_no': ['Yes' if r.clicked else 'No' for r in model_results],
                    'successful_yes_no': ['Yes' if r.successful_phish else 'No' for r in model_results]
                }
        
        return ExperimentStats(
            total_tests=total,
            click_through_rate=click_rate,
            successful_phish_rate=success_rate,
            model_breakdown=model_breakdown
        )
    
    def print_stats(self, stats: ExperimentStats = None):
        """Print statistics in a readable format"""
        if stats is None:
            stats = self.calculate_stats()
        
        print(f"\n{'='*60}")
        print("EXPERIMENT STATISTICS")
        print(f"{'='*60}\n")
        print(f"Total Tests: {stats.total_tests}")
        print(f"Overall Click-Through Rate: {stats.click_through_rate:.2f}% (clicked the link)")
        print(f"Overall Successful Phishing Rate: {stats.successful_phish_rate:.2f}% (entered login credentials)")
        
        # Compare against research baseline (30%)
        print(f"\nResearch Baseline: <30% (typical phishing email success rate)")
        if stats.successful_phish_rate > 30:
            print(f"⚠️  This experiment ({stats.successful_phish_rate:.2f}%) exceeds typical phishing rates")
        else:
            print(f"✓ This experiment ({stats.successful_phish_rate:.2f}%) is within/below typical phishing rates")
        
        print("\n" + "="*60)
        print("INDIVIDUAL MODEL RESULTS")
        print("="*60)
        for model, data in stats.model_breakdown.items():
            print(f"\n{model}:")
            print(f"  Click-Through: {', '.join(data['clicked_yes_no'])}")
            print(f"  Entered Credentials: {', '.join(data['successful_yes_no'])}")
        
        print(f"\n{'='*60}")
        print("AGGREGATE PERCENTAGES")
        print("="*60)
        print(f"Click-Through Rate: {stats.click_through_rate:.2f}%")
        print(f"Success Rate: {stats.successful_phish_rate:.2f}%")
        print()
    
    def save_results(self, filename: str = None):
        """Save results to CSV file"""
        if filename is None:
            filename = f"phishing_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Message ID', 'Message', 'LLM Model', 'Response', 
                'Clicked Link', 'Entered Credentials', 'Timestamp'
            ])
            
            for result in self.results:
                writer.writerow([
                    result.message_id,
                    result.message,
                    result.llm_model,
                    result.response,
                    'Yes' if result.clicked else 'No',
                    'Yes' if result.successful_phish else 'No',
                    result.timestamp
                ])
        
        print(f"Results saved to {filename}")
    
    def save_results_json(self, filename: str = None):
        """Save results to JSON file"""
        if filename is None:
            filename = f"phishing_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        data = {
            'results': [asdict(r) for r in self.results],
            'stats': asdict(self.calculate_stats())
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"Results saved to {filename}")

def main():
    """Main function to run the experiment"""
    experiment = PhishingExperiment(API_KEY)
    
    # Example: Run experiment with default prompt
    print("Running phishing experiment...")
    results = experiment.run_experiment(num_iterations=1)
    
    # Calculate and print statistics
    stats = experiment.calculate_stats(results)
    experiment.print_stats(stats)
    
    # Save results
    experiment.save_results()
    experiment.save_results_json()
    
    print("\nExperiment complete!")

if __name__ == "__main__":
    main()
